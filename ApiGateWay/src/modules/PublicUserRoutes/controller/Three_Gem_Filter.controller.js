import ThreeFilter_Service from "../services/Three_Gem_Filter.service.js"

const Gem_ThreeFilter = async(req,res)=>{
    try{
         const gem_id = Number(req.params.gem_id);
        const { color_id, shape_id, crt, page, limit } = req.query;

        const data = await ThreeFilter_Service.Get_Gem_ThreeFilter(gem_id,Number(color_id),Number(shape_id),Number(crt),page,limit);
        console.log("Check in Three Filter controller");
        
        console.log(data);

        res.status(200).json(data);
        
    }
    catch(error){
        console.log("Error in Three Filter controller ",error);
        res.status(500).json(error);
    }
}

export default {Gem_ThreeFilter}