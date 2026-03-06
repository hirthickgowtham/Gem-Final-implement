import axios from "axios";

const Edit_Color_Service = async(color_id,ColorName)=>{
    try{
        const result = await axios.patch(`${process.env.MICRO_SERVICE_1_URL}/api/edit/edit_color_name`,
            {
                color_id:color_id,
                color_name:ColorName
            },
            {
                headers:{
                     "Content-Type": "application/json"
                }
            }
        )

        console.log(result.data);
        return result.data
        
    }
    catch(error){
        console.log("error in service",error);
        
        throw error
    }
}


export default {Edit_Color_Service}