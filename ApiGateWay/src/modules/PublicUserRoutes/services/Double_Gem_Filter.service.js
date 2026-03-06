import axios from "axios";

const Get_Gem_DoubleFilter = async(gem_id,filter1,filter2,page,limit,value1,value2)=>{

    console.log("Service 1");
        try{
            const result = await axios.get(`${process.env.MICRO_SERVICE_1_URL}/api/double_filter_gem/${gem_id}/category_1/${filter1}/${filter2}`,
            {
                params:{
                    page,limit,value1,value2
                }
            })

            // console.log("Check Double Filter services");
            // console.log(result.data);

            return result.data
            
        }
        catch(error){
            console.log("Error in Double Filter service ",error.message);
            return error;
        }
}

export default {Get_Gem_DoubleFilter}