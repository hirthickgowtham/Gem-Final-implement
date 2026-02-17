import axios from "axios";

const Get_DoubleFilter_Count = async(gem_id,filter1,filter2,value1,value2)=>{
        try{
            const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/helper/double_filter/${gem_id}/category_1/${filter1}/${filter2}`,
                {
                    params:{
                        value1,value2
                    }
                }
            )

            console.log("check in double filter count service - api gateway");

            return result.data;
            
        }
        catch(error){
             console.log("error in double filter count service - api gateway ",error);
             return error
        }
}

export default {Get_DoubleFilter_Count}