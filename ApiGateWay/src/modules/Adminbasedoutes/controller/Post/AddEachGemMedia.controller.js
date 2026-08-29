import busboy from "busboy";
import path from "path";
import RandomName from "../../../../utils/RandomName.js";
import UploadStreamMediaFilesAws from "../../../../utils/MediaFilesAws/UploadStreamMediaFilesAws.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import AddMediaStatus_Service from "../../services/Post/AddMediaStatus.service.js";
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";
import { producer } from "../../../../config/kafka.config.js";
import DeleteEachGemMediaByType_Service from "../../services/Delete/DeleteEachGemMediaByType.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

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
 * Controller to handle streaming media uploads for Each Gem using Busboy and AWS S3 ReadableStream multipart upload.
 */
const AddEachGemMediaController = (req, res) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
        return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    let each_gem_id = null;
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

    // 1. Handle non-file form fields (e.g. each_gem_id)
    bb.on("field", (name, val) => {
        if (name === "each_gem_id") {
            each_gem_id = val;
        }
    });

    // 2. Handle incoming file streams concurrently
    bb.on("file", (fieldname, fileStream, fileInfo, encoding, mimetype) => {
        // Normalize fileInfo across busboy versions
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
            fileStream.resume(); // Drain the rejected stream immediately
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
            const ext = path.extname(originalname) || ".mp4";
            const tempVideoName = `temp_${randomBase}${ext}`;

            videoFileMeta = {
                mimetype: fileMimeType,
                tempVideoName
            };

            const mediaEntry = {
                fileName: tempVideoName,
                fileType: fileMimeType,
                media_type: "video",
                isVideo: true
            };
            uploadedMediaMeta.push(mediaEntry);

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

            if (!each_gem_id) {
                return res.status(400).json({ error: "Each Gem ID is required" });
            }

            if (!hasFiles || fileUploadPromises.length === 0) {
                return res.status(400).json({ error: "No media files received for Each Gem" });
            }

            // Wait for all S3 streaming uploads and async conversions (PDF/etc.) to finish
            await Promise.all(fileUploadPromises);
            console.log("✅ All media files streamed to S3 successfully");

            if (uploadedMediaMeta.length === 0) {
                return res.status(400).json({ error: "No media files processed for Each Gem" });
            }

            // If a new video was uploaded, clean up old video records and S3 files
            if (videoFileMeta) {
                console.log(`⚠️ New video file detected. Cleaning up any existing video records for each_gem_id: ${each_gem_id}...`);
                try {
                    const deleteRes = await DeleteEachGemMediaByType_Service(each_gem_id, "video");
                    if (deleteRes && deleteRes.success && Array.isArray(deleteRes.existing)) {
                        for (const oldVideo of deleteRes.existing) {
                            if (oldVideo.media_file && !oldVideo.media_file.startsWith("temp_")) {
                                console.log(`🗑️ Deleting old video file from S3: ${oldVideo.media_file}`);
                                try {
                                    await DeleteMediaFilesAws(oldVideo.media_file);
                                } catch (s3Err) {
                                    console.error(`Failed to delete S3 file ${oldVideo.media_file}:`, s3Err.message);
                                }
                            }
                        }
                    }
                } catch (cleanupErr) {
                    console.error("Failed to clean up existing video records:", cleanupErr.message);
                }
            }

            // Prepare filenames for database registration
            const filenames = uploadedMediaMeta.map(file => ({
                media_file: file.fileName,
                media_type: file.media_type
            }));

            const MediaUploadData = await AddEachGemMedia(each_gem_id, filenames);

            // Retrieve the media ID of the video from DB response
            let videoMediaId = null;
            if (videoFileMeta && MediaUploadData && MediaUploadData.success && Array.isArray(MediaUploadData.data)) {
                const videoIndex = filenames.findIndex(item => item.media_type === "video");
                if (videoIndex !== -1 && MediaUploadData.data[videoIndex]) {
                    videoMediaId = MediaUploadData.data[videoIndex].media_id;
                }
            }

            // Register 'pending' status in media_status table & dispatch Kafka job
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

            // Return 200 response immediately to the frontend
            return res.status(200).json({
                message: "Media files uploaded successfully. Video is processing in background.",
                MediaUploadData
            });

        } catch (error) {
            console.error("Error in AddEachGemMedia controller during completion:", error);
            return res.status(500).json({ error: "Failed to add media for Each Gem" });
        }
    });

    bb.on("error", (error) => {
        console.error("Busboy parsing error in AddEachGemMedia:", error);
        return res.status(500).json({ error: "Error processing media upload stream" });
    });

    // Pipe the raw incoming request readable stream into Busboy
    req.pipe(bb);
};

export default AddEachGemMediaController;