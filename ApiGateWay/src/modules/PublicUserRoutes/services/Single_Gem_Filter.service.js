import axios from "axios";

const Get_Gem_SingleFinal = async(category,gem_id,page,limit,filter,value) =>{
        try{
            const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/single_filter_gem/${gem_id}/${category}`,
                {
                    params:{
                        page,
                        limit,
                        filter,
                        value
                    }
                }
            )
            console.log("check Single filter check");

            console.log("The return from service 1 for single filter ",result.data);

            return result.data;            
            
        }
        catch(error){
            console.log("Error in single Filter API gateway - .service",error.message);
            
            throw error;
        }
}   


export default {Get_Gem_SingleFinal};