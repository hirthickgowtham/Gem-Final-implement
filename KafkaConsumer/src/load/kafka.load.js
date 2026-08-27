import { consumer } from "../config/kafka.config.js";
import DownloadMediaFilesAws from "../utils/MediaFilesAws/DownloadMediaFilesAws.js";
import UploadStreamMediaFilesAws from "../utils/MediaFilesAws/UploadStreamMediaFilesAws.js";
import DeleteMediaFilesAws from "../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import { compressVideo } from "../utils/VideoCompressor.js";
import { convertAndCompressToMp4 } from "../utils/VideoConverterAndCompress.js";
import UpdateMediaFile_Service from "../services/UpdateMediaFile.service.js";
import UpdateMediaStatus_Service from "../services/UpdateMediaStatus.service.js";
import CheckEachGemMedia_Service from "../services/CheckEachGemMedia.service.js";
import RandomName from "../utils/RandomName.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function loadKafka() {
  try {
    console.log("Connecting to Kafka consumer...");
    await consumer.connect();
    await consumer.subscribe({ topic: "video-processing", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payloadString = message.value.toString();
        console.log("📩 Kafka Consumer received message:", payloadString);

        let payload;
        try {
          payload = JSON.parse(payloadString);
        } catch (e) {
          console.error("❌ Failed to parse Kafka message payload:", e);
          return;
        }

        const { media_id, tempVideoName, fileType, each_gem_id } = payload;
        console.log(`🎬 Processing video for gem: ${each_gem_id}, media_id: ${media_id}, temp file: ${tempVideoName}`);

        // 0. Verify if the media record still exists in the DB
        try {
          const checkRes = await CheckEachGemMedia_Service([media_id]);
          if (!checkRes || !checkRes.exists) {
            console.log(`⚠️ Media record ${media_id} does not exist (gem may have been deleted). Skipping processing.`);
            // Clean up the original temp file from S3 if it still exists
            try {
              console.log(`🗑️ Cleaning up orphaned temporary video ${tempVideoName} from S3...`);
              await DeleteMediaFilesAws(tempVideoName);
            } catch (s3DelErr) {
              console.warn(`Could not clean up S3 file (may already be deleted):`, s3DelErr.message);
            }
            return; // Clean exit, commit offset
          }
        } catch (checkErr) {
          console.error(`❌ Failed to check media existence for media_id ${media_id}:`, checkErr.message);
          throw checkErr; // Rethrow to retry if the Check Service is temporarily down
        }

        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileExt = path.extname(tempVideoName) || ".mp4";
        const tempLocalInput = path.join(uploadDir, `downloaded_${uuidv4()}${fileExt}`);
        let compressedOutputPath = null;

        try {
          // 1. Stream download the original video file from S3 to disk
          console.log(`📥 Downloading original video ${tempVideoName} from S3...`);
          try {
            await DownloadMediaFilesAws(tempVideoName, tempLocalInput);
            console.log("📥 Download complete.");
          } catch (downloadError) {
            if (downloadError.name === "NoSuchKey" || downloadError.Code === "NoSuchKey" || downloadError.$metadata?.httpStatusCode === 404) {
              console.warn(`⚠️ Temporary video ${tempVideoName} not found in S3 (possibly already processed). Skipping.`);
              return; // Clean exit, will commit the offset
            }
            throw downloadError;
          }

          // 2. Perform compression and conversion
          let finalFileName;

          if (fileType !== "video/mp4") {
            // Convert non-MP4 to MP4
            console.log(`⚙️ Converting and compressing non-MP4 video...`);
            const outputDir = "./converted";
            const result = await convertAndCompressToMp4(tempLocalInput, outputDir);
            compressedOutputPath = result.outputPath;
            finalFileName = result.fileName;
          } else {
            // Native MP4, compress
            console.log(`⚙️ Compressing native MP4 video...`);
            const result = await compressVideo(tempLocalInput);
            compressedOutputPath = result.outputPath;
            finalFileName = `${RandomName()}_${Date.now()}.mp4`;
          }

          const fileStats = fs.statSync(compressedOutputPath);
          const sizeAfterMB = (fileStats.size / (1024 * 1024)).toFixed(2);
          console.log(`⚙️ Compression finished. Output size: ${sizeAfterMB} MB. Filename: ${finalFileName}`);

          // 3. Stream upload the final compressed video to S3 directly from disk via ReadableStream
          console.log(`📤 Streaming compressed video ${finalFileName} directly to S3...`);
          const fileReadStream = fs.createReadStream(compressedOutputPath);
          await UploadStreamMediaFilesAws("video/mp4", finalFileName, fileReadStream);
          console.log("📤 S3 Stream upload complete.");

          // 4. Update the Database in MicroService 2:
          // A. Update media_table with final compressed filename
          console.log(`💾 Updating media_table for media_id ${media_id} with file ${finalFileName}...`);
          await UpdateMediaFile_Service(media_id, finalFileName);

          // B. Update media_status to 'ready'
          console.log(`💾 Updating media_status for media_id ${media_id} to 'ready'...`);
          await UpdateMediaStatus_Service(media_id, "ready");
          console.log("💾 Database status updated to 'ready'.");

          // 5. Purge the temporary original raw video from S3
          console.log(`🗑️ Deleting temporary raw video ${tempVideoName} from S3...`);
          await DeleteMediaFilesAws(tempVideoName);
          console.log("🗑️ S3 temporary raw video purged successfully.");

        } catch (procError) {
          console.error(`❌ Background video transcoding failed for gem ${each_gem_id}:`, procError);
          try {
            // Update status to 'failed' in DB
            console.log(`💾 Marking media_id ${media_id} as 'failed' in media_status...`);
            await UpdateMediaStatus_Service(media_id, "failed");

            // Purge temporary original raw video from S3 on failure
            console.log(`🗑️ Purging temporary raw video ${tempVideoName} from S3 due to failure...`);
            await DeleteMediaFilesAws(tempVideoName);
          } catch (errCleanup) {
            console.error("❌ Failed during error cleanup in DB/S3:", errCleanup.message);
          }
        } finally {
          // 6. Clean up all local temporary disk files
          if (fs.existsSync(tempLocalInput)) {
            try {
              fs.unlinkSync(tempLocalInput);
            } catch (unlinkErr) {
              console.warn("Could not delete temp local input file:", unlinkErr.message);
            }
          }
          if (compressedOutputPath && fs.existsSync(compressedOutputPath)) {
            try {
              fs.unlinkSync(compressedOutputPath);
            } catch (unlinkErr) {
              console.warn("Could not delete compressed temp file:", unlinkErr.message);
            }
          }
          console.log("🧹 Local temporary files cleaned up.");
        }
      }
    });
    console.log("✅ Kafka Consumer subscribed and listening on topic: video-processing");
  } catch (consError) {
    console.error("❌ Error starting Kafka consumer:", consError.message || consError);
  }
}

export default loadKafka;
