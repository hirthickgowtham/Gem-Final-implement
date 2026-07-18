import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";
import { producer } from "../../../../config/kafka.config.js";

import path from "path";

const AddEachGem = async (req, res) => {
  try {
    console.log("Files received:", req.files.length);

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

    // 2. Create EachGem in DB
    const gemDetails = {
      lot_number: req.body.lot_number,
      description: req.body.description,
      crt: Number(req.body.crt),
      number_of_gems: Number(req.body.number_of_gems),
      gem_id: Number(req.body.gem_id),
      category: Number(req.body.category),
      color_id: Number(req.body.color_id),
      shape_id: Number(req.body.shape_id)
    };

    console.log("Gem details to be added:", gemDetails);

    // 3. Start uploading images, pdf and temporary original video directly to S3 in parallel
    const s3UploadPromises = formattedFiles.map(file => {
      console.log("Starting upload to S3:", file.fileName);
      return UploadMediaFilesAws(
        file.fileType,
        file.fileName,
        file.buffer
      );
    });

    // 2. Create EachGem in DB concurrently with S3 uploads
    const dbGemPromise = AddNewEachGem(gemDetails);

    // Wait for all uploads and the DB creation to finish
    const [_, result] = await Promise.all([
      Promise.all(s3UploadPromises),
      dbGemPromise
    ]);
    const Each_Gem_Id = result.data.each_gem_id;

    // 4. Prepare data for database media registration (using 'Pending' for video)
    const filenames = formattedFiles.map(file => {
      const type = file.fileType.split("/")[0];
      return {
        media_file: file.isVideo ? "Pending" : file.fileName,
        media_type: type === "application" ? file.fileType.split("/")[1] : type
      };
    });

    const MediaUploadData = await AddEachGemMedia(Each_Gem_Id, filenames);

    // 5. Retrieve the media ID of the 'Pending' video from response
    let pendingMediaId = null;
    if (videoFile && MediaUploadData && MediaUploadData.success && Array.isArray(MediaUploadData.data)) {
      const videoIndex = filenames.findIndex(item => item.media_file === "Pending");
      if (videoIndex !== -1 && MediaUploadData.data[videoIndex]) {
        pendingMediaId = MediaUploadData.data[videoIndex].media_id;
      }
    }

    // 6. Send video processing task to Kafka if enabled
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
                  each_gem_id: Each_Gem_Id
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

    // 7. Send 200 response immediately to the frontend
    return res.status(200).json({
      message: "Gem created successfully. Video is processing in background.",
      each_gem_id: Each_Gem_Id,
      MediaUploadData,
      serviceRes: result
    });

  } catch (error) {
    console.log("Error in AddEachGem controller:", error);

    const errorMessage = error.response?.data?.message || error.message || "Internal Server Error";
    
    return res.status(500).json({
      message: errorMessage,
      status: false
    });
  }
};

export default { AddEachGem };