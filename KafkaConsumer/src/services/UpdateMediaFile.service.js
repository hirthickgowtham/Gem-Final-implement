import axios from "axios";

/**
 * Updates the media_file column in media_table for a given media_id
 * @param {number} media_id 
 * @param {string} finalFileName 
 */
const UpdateMediaFile_Service = async (media_id, finalFileName) => {
    try {
        const response = await axios.patch(
            `${process.env.MICRO_SERVICE_2_URL}/api/each_gem_media_edit`,
            {
                values: [
                    {
                        media_id: Number(media_id),
                        media_file: finalFileName
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in UpdateMediaFile service:", error.message);
        throw new Error(error.message);
    }
};

export default UpdateMediaFile_Service;
