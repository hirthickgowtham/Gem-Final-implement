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
            console.log(`Error in SingleFilter API gateway`, error.message);
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }
            return res.status(500).json({ success: false, message: "Internal Gateway Error", error: error.message });
        }


}


export default {Gem_SingleFilter};