// Load Kafka producer and consumer configuration file
import { producer, consumer } from "../config/kafka.config.js";
import DownloadMediaFilesAws from "../utils/MediaFilesAws/DownloadMediaFilesAws.js";
import UploadMediaFilesAws from "../utils/MediaFilesAws/UploadMediaFilesAws.js";
import DeleteMediaFilesAws from "../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import { compressVideo } from "../utils/VideoCompressor.js";
import { convertAndCompressToMp4 } from "../utils/VideoConverterAndCompress.js";
import RemoveEachGemMedia_Service from "../modules/Adminbasedoutes/services/Delete/RemoveEachGemMedia.service.js";
import AddEachGemMedia from "../modules/Adminbasedoutes/services/Post/AddEachGem/AddEachGemMedia.service.js";
import CheckEachGemMedia_Service from "../modules/Adminbasedoutes/services/CheckEachGemMedia.service.js";
import RandomName from "../utils/RandomName.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function loadKafka() {
  if (process.env.KAFKA_ENABLED !== "true") {
    console.log("ℹ️ Kafka is disabled (KAFKA_ENABLED != true). Skipping producer/consumer connection.");
    return;
  }

  try {
    console.log("Connecting to Kafka producer...");
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully");
  } catch (error) {
    console.error("❌ Error loading Kafka Producer:", error.message || error);
  }

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

        // 0. Verify if the pending media record still exists in the DB
        try {
          const checkRes = await CheckEachGemMedia_Service([media_id]);
          if (!checkRes || !checkRes.exists) {
            console.log(`⚠️ Media record ${media_id} is no longer Pending or does not exist. Skipping processing.`);
            // Clean up the original file from S3 if it still exists
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

        try {
          // 1. Download the original video file from S3
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
          let compressedBuffer;
          let finalFileName;

          if (fileType !== "video/mp4") {
            // Convert to MP4
            console.log(`⚙️ Converting and compressing non-MP4 video...`);
            const outputDir = "./converted";
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }
            const result = await convertAndCompressToMp4(tempLocalInput, outputDir);
            compressedBuffer = result.buffer;
            finalFileName = result.fileName;
          } else {
            // Already MP4, just compress
            console.log(`⚙️ Compressing native MP4 video...`);
            const fileBuffer = fs.readFileSync(tempLocalInput);
            compressedBuffer = await compressVideo(fileBuffer);
            finalFileName = `${RandomName()}_${Date.now()}.mp4`;
          }

          const sizeAfterMB = (compressedBuffer.length / (1024 * 1024)).toFixed(2);
          console.log(`⚙️ Processing finished. Output size: ${sizeAfterMB} MB. Filename: ${finalFileName}`);

          // 3. Upload the final compressed video to S3
          console.log(`📤 Uploading compressed video ${finalFileName} to S3...`);
          await UploadMediaFilesAws("video/mp4", finalFileName, compressedBuffer);
          console.log("📤 Upload complete.");

          // 4. Update the Database:
          // A. Delete the Pending database record
          console.log(`🗑️ Deleting Pending media record ${media_id} from DB...`);
          await RemoveEachGemMedia_Service([media_id]);

          // B. Add the new final media record
          console.log(`💾 Inserting final video media record ${finalFileName} into DB...`);
          await AddEachGemMedia(each_gem_id, [{ media_type: "video", media_file: finalFileName }]);
          console.log("💾 Database update successful.");

          // 5. Delete the temporary original video from S3
          console.log(`🗑️ Deleting temporary original video ${tempVideoName} from S3...`);
          await DeleteMediaFilesAws(tempVideoName);
          console.log("🗑️ Cleanup from S3 complete.");

        } catch (procError) {
          console.error(`❌ Background processing failed for gem ${each_gem_id}:`, procError);
          try {
            console.log(`🗑️ Cleaning up Pending media record ${media_id} from DB due to failure...`);
            await RemoveEachGemMedia_Service([media_id]);
            // Clean up temporary original video from S3 on failure
            console.log(`🗑️ Deleting temporary original video ${tempVideoName} from S3 due to failure...`);
            await DeleteMediaFilesAws(tempVideoName);
          } catch (dbErr) {
            console.error("❌ Failed to register processing failure in DB/S3:", dbErr);
          }
        } finally {
          // 6. Clean up local temp files
          if (fs.existsSync(tempLocalInput)) {
            fs.unlinkSync(tempLocalInput);
          }
          console.log("🧹 Local temporary files cleaned up.");
        }
      }
    });
    console.log("✅ Kafka Consumer subscribed and running successfully");
  } catch (consError) {
    console.error("❌ Error starting Kafka consumer:", consError.message || consError);
  }
}

export default loadKafka;