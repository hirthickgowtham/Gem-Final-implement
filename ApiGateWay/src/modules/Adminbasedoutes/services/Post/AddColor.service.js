

import axios from "axios";

const AddColorService = async(color)=>{
    try{
        const result = await axios.post(`${process.env.MICRO_SERVICE_1_URL}/api/edit/add_color`,
            {color_name:color},
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


export default {AddColorService}