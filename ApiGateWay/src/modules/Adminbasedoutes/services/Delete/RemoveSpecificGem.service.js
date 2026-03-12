import axios from "axios";

const RemoveEachGemService = async (each_gem_id) => {
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_1_URL}/api/edit/remove_specific_gem`, {
            data: 
            {
                each_gem_id
            },
            headers: 
            {
                "Content-Type": "application/json"
            }
        });
        console.log("Response from RemoveEachGemService:", response);  
        return response.data;
    } catch (error) {
        console.error("Error in RemoveEachGemService:", error);
        throw error;
    }
}

export default RemoveEachGemService;