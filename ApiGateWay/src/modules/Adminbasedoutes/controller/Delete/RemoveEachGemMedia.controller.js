import RemoveEachGemMedia_Service from "../../services/Delete/RemoveEachGemMedia.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

const RemoveEachGemMedia = async(req,res)=>{
    try {
        const {medias_to_remove} = req.body;


        const media_ids = medias_to_remove.map(media=>media.media_id);
        const media_file_names = medias_to_remove.map(media=>media.file_name);


        console.log("Media file names received in controller",media_file_names);
        console.log("Media Ids received in controller",media_ids);

        if(!media_file_names || media_file_names.length === 0){
           return res.status(400).json({message:"Media Ids are required and media file name are requeired"})
        }

        for(let file_name of media_file_names){
            console.log("Deleting file from AWS S3 with file name",file_name);
            const response = await DeleteMediaFilesAws(file_name);
            console.log("Response from AWS S3 delete operation",response);
        }
        
        const data  = await RemoveEachGemMedia_Service(media_ids);
        console.log(data);

        return res.status(200).json({
            message:"getting data",
            data
        })
    }
    catch (error) {
        console.log("Error in RemoveEachGemMedia controller",error);   
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export default {RemoveEachGemMedia}
        