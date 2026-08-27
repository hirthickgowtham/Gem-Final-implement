import axios from "axios";

const CheckEachGemMedia_Service = async (media_ids) => {
    try {
        const response = await axios.post(`${process.env.MICRO_SERVICE_2_URL}/api/each_gem_id_media_check`, {
            media_ids
        });
        return response.data;
    } catch (error) {
        console.error("Error in CheckEachGemMedia service:", error.message);
        throw error;
    }
};

export default CheckEachGemMedia_Service;
