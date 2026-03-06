import axios from "axios";

const Get_GemColorTypes = async()=>{
    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/helper/color_type`);

        console.log(result.data);

        return result.data;
        
    }
    catch(error){   
        console.log("Error color type service - api gateway");
        throw error;
        
    }
}

export default {Get_GemColorTypes}