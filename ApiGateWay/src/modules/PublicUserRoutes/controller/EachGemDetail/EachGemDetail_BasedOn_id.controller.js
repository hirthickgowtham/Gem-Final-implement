import GemDetails_Service from "../../services/EachGemDetail/EachGemDetail_BasedOn_id.service.js"

const GemDetail_id = async(req,res)=>{
    try{
         const each_gem_id = Number(req.params.each_gem_id);

        const data = await GemDetails_Service.Get_EachGemDetails(each_gem_id);

        console.log(data);

        res.status(200).json(data);
        
    }
    catch(error){
        console.log("error in each_gem_detail based on each_gem_id ,",error.message);

        res.status(500).json(error.message);
        
    }
}

export default {GemDetail_id}