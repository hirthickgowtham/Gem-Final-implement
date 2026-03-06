import GetInventory from "../services/GemInventory.services.js"
import sendresponse from "../../../utils/response.js";


const GemList = async(req,res)=>{

    try{
       const { gem_id, category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        console.log(req.params,req.query);


        
            const data = await GetInventory.Get_Gem_List(gem_id,category,page,limit);
            console.log("Check in controller 1");
            console.log(data);
            console.log("Check in controller 2");
            // return sendresponse(res,200,true,`gems Returned with category:${category} and gem_id:${gem_id}`,data)
             res.status(200).json(data);
        }
        catch(e){
            console.log(`Error in API gateway controller ${e}`)
            return sendresponse(res,500,false,`Gem fetching failed`,e);
        }
}


export default {GemList}