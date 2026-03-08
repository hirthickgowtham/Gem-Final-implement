import axios from "axios";

const AddGemDetails_Service = async(gem_name,gem_division)=>{
    try{
        const response = await axios.post(`${process.env.MICRO_SERVICE_1_URL}/api/edit/add_gem`,
            {
                gem_name,
                gem_division
            },
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )

        console.log("Message in services",response.data);

        return response.data;
    }
    catch(error){
        console.log(error.message);
        throw error;
    }
}

export default {AddGemDetails_Service}