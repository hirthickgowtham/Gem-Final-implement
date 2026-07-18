import axios from "axios";

const DeleteEachGemMediaByType_Service = async (each_gem_id, media_type) => {
    try {
        const response = await axios.delete(`${process.env.MICRO_SERVICE_2_URL}/api/delete_each_gem_media_by_type`, {
            data: { each_gem_id, media_type }
        });
        return response.data;
    } catch (error) {
        console.error("Error in DeleteEachGemMediaByType service:", error.message);
        throw error;
    }
}

export default DeleteEachGemMediaByType_Service;
