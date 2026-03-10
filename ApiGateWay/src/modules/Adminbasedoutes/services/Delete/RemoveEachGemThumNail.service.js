import axios from "axios";

const RemoveEachGemThumNailService = async(each_gem_id)=>{
    try {
        // Make an API call to the microservice to remove the thumbnail
        console.log("Calling microservice to remove thumbnail for each_gem_id:", each_gem_id);
       const response = await axios.delete(`${process.env.MICRO_SERVICE_2_URL}/api/delete_thumbnail_gem`,
            {
                data: { each_gem_id }
            }
        );

        // Return the response from the microservice
        return response.data;
    }
    catch (error) {
        console.error("Error in RemoveEachGemThumNailService:", error.message);
        throw new Error("An error occurred while removing the thumbnail");
    }
}

export default RemoveEachGemThumNailService;