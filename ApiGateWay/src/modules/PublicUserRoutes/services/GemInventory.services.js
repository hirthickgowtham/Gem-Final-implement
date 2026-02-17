import axios from "axios";

const Get_Gem_List = async(gem_id,category,page,limit) =>{
        try{
            const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/gem_List/${gem_id}/${category}`,
                {
                    params:{
                        page,
                        limit
                    }
                }
            );
            console.log("Check in service");
            
            console.log(result.data);
            return result.data;
        }
        catch(error){
            console.log('Error in API gateway service ',error);   
            return error;
        }
}

export default {Get_Gem_List}