import RemoveShapeService from "../../services/Delete/RemoveShape.service.js";

const RemoveShape = async(req,res)=>{
    try {
        const {shape_id} = req.body;

        if(!shape_id){
            return res.status(400).json({message:"Shape id is required"})
        }   
        // Call the service function to remove the shape
        const response = await RemoveShapeService(shape_id);    
        return res.status(200).json({
            message:"Shape removed successfully",
            response
        })
    }

        catch (error) {
        console.error("Error in RemoveShape controller:", error);
        return res.status(500).json({
            message:"Internal server error in RemoveShape controller",
            error:error.message
        })
    }
}

export default {RemoveShape}