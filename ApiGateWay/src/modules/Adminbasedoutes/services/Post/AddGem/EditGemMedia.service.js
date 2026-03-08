import axios from "axios";

const EditGemMedia_Service = async (gem_id,media_url) => {
    try{
        const response = await axios.patch(`${process.env.MICRO_SERVICE_2_URL}/api/reset_gem_id_media`,
            {
                gem_id,
                media_url
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        console.log("Response from microservice 2 for media upload:", response.data);
        return response.data;
    }
    catch(error){
        console.log("Error in EditGemMedia service",error.message);
        throw new Error(error.message);
    }
}

export default EditGemMedia_Service;