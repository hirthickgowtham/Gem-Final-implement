import axios from "axios";

const Edit_Each_Gem_Service = async(editDetails)=>{
    try{
        const response = await axios.patch(`${process.env.MICRO_SERVICE_1_URL}/api/edit/edit_each_gem_detail`,
        editDetails,
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
        );

        console.log(response.data);
        return response.data;
    }
    catch(error){ 
        console.log(error.message);
        throw error;
    }
}


export default Edit_Each_Gem_Service