import axios from "axios";

const AddEachGemMedia = async (each_gem_id, filenames) => {
    try {
        const response = await axios.post(`${process.env.MICRO_SERVICE_2_URL}/api/each_gem_id_media_upload`, {
            each_gem_id,
            filenames
        });
        return response.data;
    } catch (error) {
        console.error("Error in AddEachGemMedia service:", error.message);
        throw error;
    }
};

export default AddEachGemMedia;
