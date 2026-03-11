import axios from "axios";

const RemoveShapeService = async(shape_id)=>{
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_1_URL}/api/edit/remove_shape`,{
            data:{
                shape_id
            }
        },
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    )
        return response.data;
    } catch (error) {
        console.error("Error in RemoveShapeService:", error);
        throw new Error(error.response?.data?.message || "Failed to remove shape");
    }
}

export default RemoveShapeService;