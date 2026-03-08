import axios from "axios";

const Edit_Shape_Service = async(shape_id,ShapeName)=>{
    try{
        const result = await axios.patch(`${process.env.MICRO_SERVICE_1_URL}/api/edit/edit_shape_name`,
            {
                shape_id:shape_id,
                shape_name:ShapeName
            },
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )

        console.log(result.data);

        return result.data
        
    }
    catch(error){
        console.log("the error ",error.message);
        
        throw error
    }
}


export default {Edit_Shape_Service}