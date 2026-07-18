import UploadMediaFilesAws from "../../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import RandomName from "../../../../utils/RandomName.js";

import AddEachGemThumNailService from "../../services/Post/AddEachGemThumNail.service.js";

const AddEachGemThumNail = async(req,res)=>{
    try {
      const {each_gem_id} = req.body;
        console.log("Each gem Id", each_gem_id);
        console.log("Thumbnail file received:", req.files);

        const formatedFiles = req.files.map((file) => ({
            filename: RandomName(),
            filetype: file.mimetype.split("/")[0],
            buffer: file.buffer,
            
        }));
        console.log("Formated files:", formatedFiles);

        // Start S3 uploads in parallel
        const s3UploadPromises = formatedFiles.map(file => {
            console.log("Starting upload for file:", file.filename);
            return UploadMediaFilesAws(file.filetype, file.filename, file.buffer);
        });

        const media_url = formatedFiles.map(file => file.filename).join(" ");

        console.log("Media URLs to be saved for each_gem_id", each_gem_id, media_url);

        // Start DB insert concurrently
        const dbPromise = AddEachGemThumNailService(each_gem_id, media_url);

        // Wait for uploads and DB insert to complete
        const [_, response] = await Promise.all([
            Promise.all(s3UploadPromises),
            dbPromise
        ]);
        

        return res.status(200).json({ 
            message: "Thumbnail file received successfully",
            response

         });
    }
    catch (error) {
        console.error("Error in AddEachGemThumNail controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export default {AddEachGemThumNail}
