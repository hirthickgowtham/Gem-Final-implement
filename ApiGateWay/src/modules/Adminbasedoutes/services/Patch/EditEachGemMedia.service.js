import axios from "axios";

const EditEachGemMediaService = async (values) => {
    try {
        console.log("The req received in service ", values);
        const response = await axios.patch(`${process.env.MICRO_SERVICE_2_URL}/api/each_gem_media_edit`,
            {values},
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export default EditEachGemMediaService;