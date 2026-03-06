import axios from "axios";


const AddNewGem = async (gemDetails) => {
    try{
        const result = await axios.post(
      `${process.env.MICRO_SERVICE_1_URL}/api/edit/add_gem`,
      gemDetails, // ✅ send body
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Message in services",result.data);
    
    return result.data;
    }
    catch(error){
        console.log("Message in APi service ",error.message);
        
        throw error;
    }
    
}

export{AddNewGem}