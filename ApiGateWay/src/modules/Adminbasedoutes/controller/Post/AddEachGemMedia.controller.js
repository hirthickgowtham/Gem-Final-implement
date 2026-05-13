import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws  from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import { compressVideo } from "../../../../utils/VideoCompressor.js"; // Adjust path as needed
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";

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
      if (file.mimetype === "video/mp4") {
        const sizeBeforeMB = (file.buffer.length / (1024 * 1024)).toFixed(2);
        console.log(`--- Video Processing: ${file.originalname} ---`);
        console.log(`Size before compression: ${sizeBeforeMB} MB`);
        try {
            const compressedBuffer = await compressVideo(file.buffer);
            const sizeAfterMB = (compressedBuffer.length / (1024 * 1024)).toFixed(2);
            const savings = (((file.buffer.length - compressedBuffer.length) / file.buffer.length) * 100).toFixed(1);
            console.log(`Size after compression: ${sizeAfterMB} MB`);
            console.log(`Reduced by: ${savings}%`);
            file.buffer = compressedBuffer;
            file.size = compressedBuffer.length;
             console.log(`Compression successful for ${file.originalname}`);
        } catch (compressionError) {
            console.error(`Failed to compress ${file.originalname}, uploading original.`, compressionError);
            return res.status(500).json({
                message: `Failed to compress video ${file.originalname}. Please try again later.`,
                status: false
            });
            // If compression fails, we just continue with the original buffer
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