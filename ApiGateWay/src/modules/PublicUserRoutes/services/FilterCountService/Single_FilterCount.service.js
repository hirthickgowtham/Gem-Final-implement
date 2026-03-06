import axios from "axios";

const Get_SingleFilter_Count = async (gem_id,category,filter,value) => {
    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/helper/single_filter/${gem_id}/${category}`,
            {
                params:{
                    filter,value
                }
            }
        )

        console.log("Check Single Filter Count service - API gateway");

        console.log(result.data);

        return result.data;
        
        
    }
    catch(error){
        console.log("Error in Single Filter Count service - API gateway ",error);
        throw error;
        
    }
}

export default {Get_SingleFilter_Count}