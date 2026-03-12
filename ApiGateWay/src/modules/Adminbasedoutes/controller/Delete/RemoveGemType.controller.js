import RemoveGemTypeService from "../../services/Delete/RemoveGemType.service.js";
import DeleteMediaFilesAws from "../../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";

const RemoveGemType = async(req,res)=>{
    try {
        const {gem_type_id} = req.body;
        if(!gem_type_id){
            return res.status(400).json({message:"Gem Type Id is required"})
        }

        // Call the service function to delete the gem type
        const response = await RemoveGemTypeService(gem_type_id);
        console.log("Gem Type deleted successfully:", response);

        const media_to_remove_from_s3 = response.data[0].general_gem_image;

        const FileDelRes = await DeleteMediaFilesAws(media_to_remove_from_s3);

        console.log("Media file deleted from S3 successfully:", FileDelRes);



        return res.status(200).json({
            message:"Gem Type deleted successfully",
            data:response
        })
    } catch (error) {
        console.error("Error deleting gem type:", error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export default {RemoveGemType}