import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws  from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";
import { producer } from "../../../../config/kafka.config.js";
import DeleteEachGemMediaByType_Service from "../../services/Delete/DeleteEachGemMediaByType.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

import fs from "fs";
import path from "path";

const AddEachGemMediaController = async (req, res) => {
    const { each_gem_id } = req.body;

    if (!each_gem_id) {
        return res.status(400).json({ error: "Each Gem ID is required" });
    }

    const receivedFiles = req.files;

    if (!Array.isArray(receivedFiles) || receivedFiles.length === 0) {
        return res.status(400).json({ error: "No media files received for Each Gem" });
    }

    let certificateFile = req.files.find(file => 
        file.originalname.toLowerCase().startsWith("certificate")
    );
    console.log("Certificate file found:", !!certificateFile);

    if (certificateFile && certificateFile.mimetype !== "application/pdf") {
        console.log("Size before PDF conversion:", (certificateFile.buffer.length / 1024).toFixed(2), "KB");
        certificateFile.buffer = await imagesToPdf(certificateFile.buffer);
        certificateFile.mimetype = "application/pdf";
        certificateFile.originalname = "certificate.pdf";
        console.log("Size after PDF conversion:", (certificateFile.buffer.length / 1024).toFixed(2), "KB");
    }

    // 1. Find the video file and format media files
    let videoFile = req.files.find(file => file.mimetype.startsWith("video/"));
    let tempVideoName = null;

    const formattedFiles = req.files.map(file => {
        const isVideo = file.mimetype.startsWith("video/");
        let fileName;

        if (isVideo) {
            // Generate temporary name for S3 upload
            const randomBase = RandomName();
            const ext = path.extname(file.originalname) || ".mp4";
            fileName = `temp_${randomBase}${ext}`;
            tempVideoName = fileName;
        } else {
            fileName = RandomName();
        }

        return {
            fileName,
            fileType: file.mimetype,
            buffer: file.buffer,
            isVideo
        };
    });

    try {
        // If a new video is being uploaded, delete the previous video records and their S3 files
        if (videoFile) {
            console.log(`⚠️ New video file detected. Cleaning up any existing video records for each_gem_id: ${each_gem_id}...`);
            try {
                const deleteRes = await DeleteEachGemMediaByType_Service(each_gem_id, "video");
                if (deleteRes && deleteRes.success && Array.isArray(deleteRes.existing)) {
                    for (const oldVideo of deleteRes.existing) {
                        if (oldVideo.media_file !== "Failed" && oldVideo.media_file !== "Pending") {
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

        // 2. Start uploading images, pdf, and temporary original video directly to S3 in parallel
        const s3UploadPromises = formattedFiles.map(file => {
            console.log("Starting upload to S3:", file.fileName);
            return UploadMediaFilesAws(
                file.fileType,
                file.fileName,
                file.buffer
            );
        });

        // Wait for all S3 uploads to finish
        await Promise.all(s3UploadPromises);

        // 3. Prepare data for database media registration (using 'Pending' for video)
        const filenames = formattedFiles.map(file => {
            const type = file.fileType.split("/")[0];
            return {
                media_file: file.isVideo ? "Pending" : file.fileName,
                media_type: type === "application" ? file.fileType.split("/")[1] : type
            };
        });

        const MediaUploadData = await AddEachGemMedia(each_gem_id, filenames);

        // 4. Retrieve the media ID of the 'Pending' video from response
        let pendingMediaId = null;
        if (videoFile && MediaUploadData && MediaUploadData.success && Array.isArray(MediaUploadData.data)) {
            const videoIndex = filenames.findIndex(item => item.media_file === "Pending");
            if (videoIndex !== -1 && MediaUploadData.data[videoIndex]) {
                pendingMediaId = MediaUploadData.data[videoIndex].media_id;
            }
        }

        // 5. Send video processing task to Kafka if enabled
        if (videoFile && pendingMediaId && tempVideoName) {
            console.log("Sending video processing job to Kafka...");
            if (process.env.KAFKA_ENABLED === "true") {
                try {
                    await producer.send({
                        topic: "video-processing",
                        messages: [
                            {
                                value: JSON.stringify({
                                    media_id: pendingMediaId,
                                    tempVideoName: tempVideoName,
                                    fileType: videoFile.mimetype,
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

        // 6. Return 200 response immediately to the frontend
        return res.status(200).json({
            message: "Media files uploaded successfully. Video is processing in background.",
            MediaUploadData
        });

    } catch (error) {
        console.log("Error in AddEachGemMedia controller:", error);
        return res.status(500).json({ error: "Failed to add media for Each Gem" });
    }
};

export default AddEachGemMediaController;