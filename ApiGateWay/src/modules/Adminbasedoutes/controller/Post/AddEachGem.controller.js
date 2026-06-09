import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import { compressVideo } from "../../../../utils/VideoCompressor.js"; // Adjust path as needed
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import {convertAndCompressToMp4} from "../../../../utils/VideoConverterAndCompress.js"

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

   // 1. CONVERSION & COMPRESSION STEP
    for (const file of req.files) {
      if (file.mimetype.startsWith("video/")) {
        console.log(`--- Processing Video: ${file.originalname} ---`);
        const sizeBeforeMB = (file.buffer.length / (1024 * 1024)).toFixed(2);
        console.log(`Size before processing: ${sizeBeforeMB} MB`);

        if (file.mimetype !== "video/mp4") {
          // CASE A: Video needs conversion AND compression
          console.log(`Converting and compressing ${file.originalname} to MP4...`);

          const uploadDir = './uploads';
          // FIX 1: Ensure the directory exists before writing to it
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const tempInputPath = path.join('./uploads', `temp_${uuidv4()}${path.extname(file.originalname)}`);
          fs.writeFileSync(tempInputPath, file.buffer);
          const outputDir = './converted';

          try {
            // Run combined optimization utility
            const result = await convertAndCompressToMp4(tempInputPath, outputDir);
            
            // CRITICAL FIXES: Update the file references in req.files array

            console.log("return result:", result);
            file.buffer = result.buffer;
            file.size = result.buffer.length;
            file.mimetype = "video/mp4"; // Correcting type for AWS S3 mapping
            file.originalname = result.fileName;

            const sizeAfterMB = (file.buffer.length / (1024 * 1024)).toFixed(2);
            console.log(`Conversion/Compression complete. New Size: ${sizeAfterMB} MB`);

          } catch (error) {
            console.error(`Failed to process non-MP4 video ${file.originalname}:`, error);
            return res.status(500).json({ status: false, message: `Processing error on ${file.originalname}` });
          } finally {
            if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
          }

        } else {
          // CASE B: Video is already an MP4. Just run standard compression.
          console.log(`Video is already MP4. Running standard compression on ${file.originalname}...`);
          try {
            const compressedBuffer = await compressVideo(file.buffer);
            
            file.buffer = compressedBuffer;
            file.size = compressedBuffer.length;
            
            const sizeAfterMB = (file.buffer.length / (1024 * 1024)).toFixed(2);
            console.log(`Compression successful. New Size: ${sizeAfterMB} MB`);
          } catch (compressionError) {
            console.error(`Failed to compress native MP4 ${file.originalname}`, compressionError);
            return res.status(500).json({ status: false, message: "Compression failure." });
          }
        }
      }
    }

    // 2. Formatting files (now containing compressed buffers where applicable)
    const formattedFiles = req.files.map(file => ({
      fileName: RandomName(),
      fileType: file.mimetype,
      buffer: file.buffer
    }));

    // 3. Gem details processing
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

    const result = await AddNewEachGem(gemDetails);
    const Each_Gem_Id = result.data.each_gem_id;

    // 4. Upload to S3
    for (const file of formattedFiles) {
      console.log("Uploading to S3:", file.fileName);
      await UploadMediaFilesAws(
        file.fileType,
        file.fileName,
        file.buffer
      );
    }

    // 5. Prepare data for Microservice 2
    const filenames = formattedFiles.map(file => {
      const type = file.fileType.split("/")[0];
      return {
        media_file: file.fileName,
        media_type: type === "application" ? file.fileType.split("/")[1] : type
      };
    });

    const MediaUploadData = await AddEachGemMedia(Each_Gem_Id, filenames);

    return res.status(200).json({
      message: "Gem created successfully",
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