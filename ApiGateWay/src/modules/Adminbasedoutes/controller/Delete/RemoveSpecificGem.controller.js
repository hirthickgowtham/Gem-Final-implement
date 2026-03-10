import RemoveEachGemService  from "../../services/Delete/RemoveSpecificGem.service.js";

const RemoveEachGem = async (req,res) => {
    try {
        const {each_gem_id} = req.body;
        if(!each_gem_id){
            return res.status(400).json({message:"each_gem_id is required"})
        }

        // Call the service function to remove the gem
        const response = await RemoveEachGemService(each_gem_id);
        
        console.log(response);
        return res.status(200).json({
            message:"Gem removed successfully",
            response
        })

    } catch (error) {
        console.error("Error in RemoveEachGem controller:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }       
}

export default {RemoveEachGem}
