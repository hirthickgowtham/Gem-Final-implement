import axios from "axios";

const AddEachGemMedia = async (each_gem_id,values) => {

    try{
        const response = await axios.post(`${process.env.MICRO_SERVICE_2_URL}/api/each_gem_id_media_upload`,
            {
                each_gem_id,
                values
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Response from microservice 2 for media upload:", response.data);
        return response.data;
    }
    catch(error){
        console.log("Error in AddEachGemMedia service",error.message);
        throw new Error(error.message);
    }

}

export default AddEachGemMedia;