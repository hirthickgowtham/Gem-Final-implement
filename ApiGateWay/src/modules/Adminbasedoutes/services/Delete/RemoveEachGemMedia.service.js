import axios from "axios";

const RemoveEachGemMedia_Service = async(media_ids)=>{
    try {
        console.log("Media Ids received in service",media_ids);
        const response = await axios.delete(`${process.env.MICRO_SERVICE_2_URL}/api/each_gem_id_media_delete`,{
            data:{
                media_ids
            }
        })
        console.log("Response from media service",response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error in RemoveEachGemMedia service",error);
        throw error;
    }
}

export default RemoveEachGemMedia_Service;