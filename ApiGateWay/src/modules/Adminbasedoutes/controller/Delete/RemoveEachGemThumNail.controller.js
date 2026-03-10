import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import RemoveEachGemThumNailService from "../../services/Delete/RemoveEachGemThumNail.service.js";

const RemoveEachGemThumNail = async(req,res)=>{
    try {
        const {each_gem_id,media_url} = req.body;
        if(!each_gem_id){
            return res.status(400).json({message:"Each Gem Id is required"})
        }   
        // Call the service function to remove the thumbnail

        console.log(each_gem_id,media_url);

        const response = await DeleteMediaFilesAws(media_url);
        console.log("AWS delete response:", response);

        const data = await RemoveEachGemThumNailService(each_gem_id);
        console.log("Controller response:", data);
        return res.status(200).json({
            message:"Data recevied",
            data
        })
    }
    catch (error) {
        console.error("Error in RemoveEachGemThumNail controller:", error.message);
        return res.status(500).json({
            message:"An error occurred while removing the thumbnail",
            error:error.message
        })
    }
}

export default {RemoveEachGemThumNail}