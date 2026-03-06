import axios from "axios";

const Get_EachGemDetails = async (each_gem_id) => {

try{
    const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/each_gem_detail/based_on_gem_id/${each_gem_id}`);

    console.log("Check for each Gem detail based on ID - api gateway services");

    return result.data;
    
}
catch(error){
    console.log("error in each gem detail based on ID ,",error.message);
    return error;
    
}
    
}

export default {Get_EachGemDetails}