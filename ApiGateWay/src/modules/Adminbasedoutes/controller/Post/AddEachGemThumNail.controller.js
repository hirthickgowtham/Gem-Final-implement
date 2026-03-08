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

        for(const file of formatedFiles){
            const uploadResult = await UploadMediaFilesAws(file.filetype, file.filename, file.buffer);
            console.log("Upload result for file:", file.filename, uploadResult);
            // Here you can save the uploadResult URL to your database associated with the each_gem_id
        }

        const media_url = formatedFiles.map(file => file.filename).join(" "); // Assuming the filename is the URL or you can modify this to get the actual URL from the upload result

        console.log("Media URLs to be saved for each_gem_id", each_gem_id, media_url);

        const response = await AddEachGemThumNailService(each_gem_id, media_url);
        

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
