import axios from "axios";

/**
 * Service to initialize media status (default 'pending') in MicroService 2
 * @param {number} media_id 
 * @param {string} status - 'pending' | 'ready' | 'failed'
 */
const AddMediaStatus_Service = async (media_id, status = "pending") => {
    try {
        const response = await axios.post(
            `${process.env.MICRO_SERVICE_2_URL}/api/media_status`,
            {
                media_id,
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
        console.error("Error in AddMediaStatus service:", error.message);
        throw new Error(error.message);
    }
};

export default AddMediaStatus_Service;
