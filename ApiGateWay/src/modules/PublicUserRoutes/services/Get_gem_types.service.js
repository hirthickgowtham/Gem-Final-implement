import axios from "axios";

const getGem = async()=>{

    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/gem_types`);
        console.log(result.data);
        return result.data;
    }
    catch(e){
        console.log("error in .service.js file ",e);
        
    }
    console.log("req received");
    return "Something is wrong!!";
}

export default {getGem}