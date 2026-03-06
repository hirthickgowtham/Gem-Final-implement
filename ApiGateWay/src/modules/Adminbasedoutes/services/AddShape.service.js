import axios from "axios";

const AddShapeService = async(shape)=>{
    try{
        const result = await axios.post(`${process.env.MICRO_SERVICE_1_URL}/api/edit/add_shape`,
            {shape_name:shape},
            {
                headers: {
                "Content-Type": "application/json"
                }
            }
        )

        console.log(result.data);

        return result.data;
    }

    catch(error){
        console.log("the error ,",error.message)
        throw error;
    }

    
}


export default {AddShapeService}