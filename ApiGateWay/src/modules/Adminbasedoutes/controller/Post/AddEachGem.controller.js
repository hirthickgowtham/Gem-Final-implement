import { AddNewEachGem } from "../../services/Post/AddEachGem/AddEachGemDetails.service.js";
import AddEachGemMedia from "../../services/Post/AddEachGem/AddEachGemMedia.service.js";
import RandomName from "../../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import { compressVideo } from "../../../../utils/VideoCompressor.js"; // Adjust path as needed
import { imagesToPdf } from "../../../../utils/ImageToPdf.js";

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
    return res.status(500).json({
      message: error.response.data.message,
      status: false
    });
  }
};

export default { AddEachGem };