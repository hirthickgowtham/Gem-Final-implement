import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws  from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import { compressVideo } from "../../../../utils/VideoCompressor.js"; // Adjust path as needed
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import {convertAndCompressToMp4} from "../../../../utils/VideoConverterAndCompress.js"

const AddEachGemMediaController = async (req,res) => {
    const {each_gem_id} = req.body;

    if(!each_gem_id){
            return res.status(400).json({ error: "Each Gem ID is required" });
    }

    const receivedFiles = req.files;

    if (!Array.isArray(receivedFiles) || receivedFiles.length === 0){
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
        // 1. COMPRESSION STEP: Process videos before formatting
    // We update the buffers in the original req.files array if they are MP4s
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
    
    const formattedFiles = receivedFiles.map(file => ({
        fileName: RandomName(),
        fileType: file.mimetype,
        buffer: file.buffer
    }));

    console.log("Formatted files for Each Gem media upload:", formattedFiles);

    try{
        // Parallel upload
        const uploadResults = await Promise.all(
            formattedFiles.map(file =>
                UploadMediaFilesAws(file.fileType, file.fileName, file.buffer)
            )
        );

        console.log("Upload results for Each Gem media files:", uploadResults);

        const fileNames = formattedFiles.map(file => {
            const [type, subtype] = file.fileType.split("/");
            return {
                media_file: file.fileName,
                media_type: type === "application" ? subtype : type
            };
        });
        console.log("File names to be associated with Each Gem ID", each_gem_id, ":", fileNames);
         // Here you would typically call a service function to associate the uploaded media files with the Each Gem details in your database, using the each_gem_id and fileNames array.
         const associationResult = await AddEachGemMedia(each_gem_id, fileNames);
         
        console.log("Result of associating media files with Each Gem ID", each_gem_id, ":", associationResult);

         return res.status(200).json({ 
            message: "Media files uploaded and associated with Each Gem successfully" ,
            data: associationResult
         });
       

    }
    catch(error){
        console.log("Error in AddEachGemMedia controller",error);
        return res.status(500).json({ error: "Failed to add media for Each Gem" }); 
    }
}


export default AddEachGemMediaController;