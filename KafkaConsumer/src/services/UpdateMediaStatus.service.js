import axios from "axios";

/**
 * Updates the processing status in media_status table for a given media_id
 * @param {number} media_id 
 * @param {string} status - 'pending' | 'ready' | 'failed'
 */
const UpdateMediaStatus_Service = async (media_id, status) => {
    try {
        const response = await axios.patch(
            `${process.env.MICRO_SERVICE_2_URL}/api/media_status`,
            {
                media_id: Number(media_id),
                status
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in UpdateMediaStatus service:", error.message);
        throw new Error(error.message);
    }
};

export default UpdateMediaStatus_Service;
