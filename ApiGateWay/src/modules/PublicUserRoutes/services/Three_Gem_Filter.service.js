import axios from "axios";

const Get_Gem_ThreeFilter = async(gem_id,color_id,shape_id,crt,page,limit)=>{
        try{
            const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/three_filter_gem/${gem_id}/category_1`,
                {
                    params:{
                        color_id, shape_id, crt, page, limit
                    }
                }
            )

            console.log("Check in Three Filter Service - API gateway");
            console.log(result.data);

            return result.data;
            
            
        }
        catch(error){
            console.log("Error in Three Filter service - API gateway",error);
            throw error;
            
        }
}

export default {Get_Gem_ThreeFilter}