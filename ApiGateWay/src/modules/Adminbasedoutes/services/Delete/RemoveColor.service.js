import axios from "axios";

const RemoveColorService = async(color_id)=>{
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_1_URL}/api/edit/remove_color`,{
            data:{
                color_id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in RemoveColorService:", error);
        throw new Error("Failed to remove color");
    }  
}

export default RemoveColorService;