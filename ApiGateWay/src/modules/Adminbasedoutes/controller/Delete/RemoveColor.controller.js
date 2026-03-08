import RemoveColorService from "../../services/Delete/RemoveColor.service.js";

const RemoveColor = async(req,res)=>{
    try {
        const {color_id} = req.body;

        if(!color_id){
            return res.status(400).json({message:"Color id is required"})
        }

        // Call the service function to remove the color
        const response = await RemoveColorService(color_id);
        return res.status(200).json({
            message:"Color removed successfully",
            response
        })
    }
    catch (error) {
        console.error("Error in RemoveColor controller:", error);
        return res.status(500).json({
            message:"Internal server error in RemoveColor controller",
            error:error.message
        })
    }
}

export default {RemoveColor}