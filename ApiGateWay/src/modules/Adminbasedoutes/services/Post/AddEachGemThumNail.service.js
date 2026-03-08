import axios from "axios";


const AddEachGemThumNailService = async(each_gem_id, media_url)=>{
    try {
        const response = await axios.post(`${process.env.MICRO_SERVICE_2_URL}/api/add_thumbnail_gem`, {
            each_gem_id,
            Url: media_url
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
        return response.data;
    }
    catch (error) {
        console.error("Error in AddEachGemThumNailService:", error);
        throw error;
    }
}

export default AddEachGemThumNailService;