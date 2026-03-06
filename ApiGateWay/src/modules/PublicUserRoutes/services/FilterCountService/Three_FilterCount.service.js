import axios from "axios";

const Get_ThreeFilter_Count = async (gem_id,shape_id,color_id,crt) => {
    try{
        const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/helper/three_filter/${gem_id}/category_1`,
            {
                params:{
                    shape_id,color_id,crt
                }
            }
        )

         console.log("check in three filter service - api gateway ");

         console.log(result.data);

         return result.data;
         
    }
    catch(error){
         console.log("error in three filter service - api gateway ",error);
         return error;
    }
}

export default {Get_ThreeFilter_Count}