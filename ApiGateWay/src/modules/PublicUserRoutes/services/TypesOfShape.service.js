import axios from "axios"

const Get_GemShapes = async()=>{
    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/helper/color_type`);

        console.log("check in service for shapes");

        return result.data;
        
    }
    catch(error){   
        console.log(error.message);
        
        throw error
    }
}

export default {Get_GemShapes}