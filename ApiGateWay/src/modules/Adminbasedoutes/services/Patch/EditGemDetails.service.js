import axios from "axios"


const EditGemDetailsService = async(Gemdetails)=>{
    try{
        const response = await axios.patch(`${process.env.MICRO_SERVICE_1_URL}/api/edit/edit_gem_detail`,
            Gemdetails,
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )

        return response.data;
    }
    catch(error){
        console.error("Error in EditGemDetailsService:",error);
        throw new Error("Failed to edit gem details in EditGemDetailsService", error)
    }
}

export default EditGemDetailsService;