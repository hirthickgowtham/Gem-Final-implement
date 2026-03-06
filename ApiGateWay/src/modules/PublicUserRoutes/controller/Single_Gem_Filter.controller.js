import SingleFilter_Service from "../services/Single_Gem_Filter.service.js"
import sendresponse from "../../../utils/response.js";

const Gem_SingleFilter = async(req,res) =>{
        try{
            const category = Number(req.params.category);
            const gem_id = Number(req.params.gem_id);
            const {page, limit, filter, value} = req.query;

            console.log(req.params,req.query);


            const data = await SingleFilter_Service.Get_Gem_SingleFinal(category,gem_id,page,limit,filter,value);
            console.log("Check in Single filter controller");
            
            console.log(data);
            console.log(typeof(data));
            // return sendresponse(res,200,true,`Single Filter from API gateway successs with category : ${category} , Gem_id : ${gem_id}`,data)
             res.status(200).json(data)
        }
        catch(error){   
            console.log(`Error in SingleFilter API gateway`,error);
            res.status(500).json(error);
            // return sendresponse(res,500,false,`Failed Single Filter from API gateway with category : ${category} , Gem_id : ${gem_id} `,error)
        }


}


export default {Gem_SingleFilter};