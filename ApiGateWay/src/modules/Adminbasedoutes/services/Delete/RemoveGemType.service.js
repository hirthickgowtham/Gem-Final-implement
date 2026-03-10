import axios from "axios";

const RemoveGemTypeService = async(gem_type_id)=>{
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_1_URL}/api/edit/remove_gem_type`,
        {
            data:{
                gem_type_id
            }
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error in RemoveGemTypeService:", error);
        throw error;
    }
}

export default RemoveGemTypeService;