import busboy from "busboy";
import path from "path";
import RandomName from "../../../../utils/RandomName.js";
import UploadStreamMediaFilesAws from "../../../../utils/MediaFilesAws/UploadStreamMediaFilesAws.js";
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";
import { producer } from "../../../../config/kafka.config.js";
import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import AddMediaStatus_Service from "../../services/Post/AddMediaStatus.service.js";

const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/webp", "image/vnd.microsoft.icon",
  "image/x-icon", "image/avif", "video/mp4", "application/pdf",
  "video/quicktime", "video/x-matroska", "video/x-msvideo",
  "video/webm", "video/mpeg", "video/ogg", "video/3gpp"
];

const allowedExtensions = [
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".mp4",
  ".pdf", ".ico", ".mov", ".mkv", ".avi", ".webm",
  ".mpeg", ".ogg", ".3gp"
];

/**
 * Controller to handle creating each gem details and streaming its media files using Busboy.
 */
const AddEachGem = (req, res) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
        return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    const gemFields = {};
    const fileUploadPromises = [];
    const uploadedMediaMeta = [];
    const validationErrors = [];
    let videoFileMeta = null;
    let hasFiles = false;

    let bb;
    try {
        bb = busboy({ headers: req.headers });
    } catch (bbErr) {
        console.error("Failed to initialize Busboy:", bbErr);
        return res.status(400).json({ error: "Failed to parse multipart request" });
    }

    // 1. Handle non-file form fields (e.g. lot_number, crt, price, etc.)
    bb.on("field", (name, val) => {
        gemFields[name] = val;
    });

    // 2. Handle incoming file streams concurrently
    bb.on("file", (fieldname, fileStream, fileInfo, encoding, mimetype) => {
        let originalname, fileMimeType;
        if (typeof fileInfo === "object" && fileInfo !== null) {
            originalname = fileInfo.filename;
            fileMimeType = fileInfo.mimeType;
        } else {
            originalname = fileInfo;
            fileMimeType = mimetype;
        }

        if (!originalname) {
            fileStream.resume(); // Drain stream if no file attached
            return;
        }

        const ext = path.extname(originalname).toLowerCase();
        const mime = fileMimeType ? fileMimeType.toLowerCase() : "";

        // File format & MIME type validation
        if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
            console.warn(`❌ Rejected file '${originalname}': disallowed extension (${ext}) or MIME type (${mime})`);
            validationErrors.push({
                file: originalname,
                extension: ext,
                mimeType: mime,
                reason: "Disallowed file extension or MIME type"
            });
            fileStream.resume();
            return;
        }

        hasFiles = true;
        const isCertificate = originalname.toLowerCase().startsWith("certificate");
        const isVideo = mime.startsWith("video/");

        // A. Handle Certificate Image (Convert to PDF via sharp + pdf-lib)
        if (isCertificate && fileMimeType !== "application/pdf") {
            const chunks = [];
            const certUploadPromise = new Promise((resolve, reject) => {
                fileStream.on("data", chunk => chunks.push(chunk));
                fileStream.on("error", err => reject(err));
                fileStream.on("end", async () => {
                    try {
                        const imageBuffer = Buffer.concat(chunks);
                        console.log("Size before PDF conversion:", (imageBuffer.length / 1024).toFixed(2), "KB");

                        const pdfBuffer = await imagesToPdf(imageBuffer);
                        console.log("Size after PDF conversion:", (pdfBuffer.length / 1024).toFixed(2), "KB");

                        const fileName = RandomName();
                        await UploadStreamMediaFilesAws("application/pdf", fileName, pdfBuffer);

                        uploadedMediaMeta.push({
                            fileName,
                            fileType: "application/pdf",
                            media_type: "pdf",
                            isVideo: false
                        });
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            fileUploadPromises.push(certUploadPromise);
            return;
        }

        // B. Handle Video Files (Stream directly to S3 multipart upload)
        if (isVideo) {
            const randomBase = RandomName();
            const videoExt = path.extname(originalname) || ".mp4";
            const tempVideoName = `temp_${randomBase}${videoExt}`;

            videoFileMeta = {
                mimetype: fileMimeType,
                tempVideoName
            };

            uploadedMediaMeta.push({
                fileName: tempVideoName,
                fileType: fileMimeType,
                media_type: "video",
                isVideo: true
            });

            console.log(`Starting S3 direct stream upload for video: ${tempVideoName}`);
            const uploadPromise = UploadStreamMediaFilesAws(fileMimeType, tempVideoName, fileStream);
            fileUploadPromises.push(uploadPromise);
            return;
        }

        // C. Handle Regular Images & standard PDFs (Stream directly to S3)
        const fileName = RandomName();
        const typeCategory = fileMimeType.split("/")[0];
        const media_type = typeCategory === "application" ? fileMimeType.split("/")[1] : typeCategory;

        uploadedMediaMeta.push({
            fileName,
            fileType: fileMimeType,
            media_type,
            isVideo: false
        });

        console.log(`Starting S3 direct stream upload for file: ${fileName} (${fileMimeType})`);
        const uploadPromise = UploadStreamMediaFilesAws(fileMimeType, fileName, fileStream);
        fileUploadPromises.push(uploadPromise);
    });

    // 3. Handle completion of stream parsing
    bb.on("close", async () => {
        try {
            if (validationErrors.length > 0) {
                return res.status(400).json({
                    error: "Invalid file format detected",
                    details: validationErrors,
                    allowedExtensions,
                    allowedMimeTypes
                });
            }

            // Wait for all S3 streaming uploads and async conversions (PDF/etc.) to finish
            if (fileUploadPromises.length > 0) {
                await Promise.all(fileUploadPromises);
                console.log("✅ All media files streamed to S3 successfully");
            }

            const {
                lot_number,
                description,
                crt,
                number_of_gems,
                gem_id,
                category,
                color_id,
                shape_id,
                price
            } = gemFields;

            const gemDetails = {
                lot_number,
                description,
                crt: Number(crt),
                number_of_gems: Number(number_of_gems),
                gem_id: Number(gem_id),
                category: Number(category),
                color_id: Number(color_id),
                shape_id: Number(shape_id),
                price: Number(price)
            };

            console.log("Gem details to be added:", gemDetails);

            // Step 1: Create Gem in Microservice 1 DB
            const gemResult = await AddNewEachGem(gemDetails);
            const each_gem_id = gemResult?.data?.each_gem_id;

            if (!each_gem_id) {
                throw new Error("Failed to retrieve each_gem_id from Microservice 1");
            }

            let MediaUploadData = null;

            // Step 2: If media files were uploaded, register them in Microservice 2 DB
            if (uploadedMediaMeta.length > 0) {
                const filenames = uploadedMediaMeta.map(file => ({
                    media_file: file.fileName,
                    media_type: file.media_type
                }));

                MediaUploadData = await AddEachGemMedia(each_gem_id, filenames);

                // Step 3: If video uploaded, register status in media_status and send Kafka message
                let videoMediaId = null;
                if (videoFileMeta && MediaUploadData && MediaUploadData.success && Array.isArray(MediaUploadData.data)) {
                    const videoIndex = filenames.findIndex(item => item.media_type === "video");
                    if (videoIndex !== -1 && MediaUploadData.data[videoIndex]) {
                        videoMediaId = MediaUploadData.data[videoIndex].media_id;
                    }
                }

                if (videoFileMeta && videoMediaId && videoFileMeta.tempVideoName) {
                    try {
                        console.log(`📝 Registering media_status as 'pending' for media_id: ${videoMediaId}...`);
                        await AddMediaStatus_Service(videoMediaId, "pending");
                        console.log("✅ media_status record created with status 'pending'");
                    } catch (statusErr) {
                        console.warn("⚠️ Could not initialize media_status:", statusErr.message);
                    }

                    console.log("Sending video processing job to Kafka...");
                    if (process.env.KAFKA_ENABLED === "true") {
                        try {
                            await producer.send({
                                topic: "video-processing",
                                messages: [
                                    {
                                        value: JSON.stringify({
                                            media_id: videoMediaId,
                                            tempVideoName: videoFileMeta.tempVideoName,
                                            fileType: videoFileMeta.mimetype,
                                            each_gem_id: Number(each_gem_id)
                                        })
                                    }
                                ]
                            });
                            console.log("✅ Kafka message published successfully");
                        } catch (kafkaError) {
                            console.error("❌ Failed to publish video processing message to Kafka:", kafkaError);
                        }
                    } else {
                        console.log("ℹ️ Kafka is disabled. Video processing skipped.");
                    }
                }
            }

            // Step 4: Return 201 response immediately
            return res.status(201).json({
                status: true,
                message: "Gem and media added successfully",
                each_gem_id,
                gemResult,
                MediaUploadData
            });

        } catch (error) {
            console.error("Error in AddEachGem controller:", error);
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || error.message || "Failed to add Each Gem";
            return res.status(statusCode).json({
                status: false,
                message: errorMessage
            });
        }
    });

    bb.on("error", (error) => {
        console.error("Busboy parsing error in AddEachGem:", error);
        return res.status(500).json({ error: "Error processing multipart upload stream" });
    });

    req.pipe(bb);
};

export default { AddEachGem };