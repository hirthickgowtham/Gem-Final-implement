import Colortypes_Service from "../services/TypesOfColor.service.js"

const Gem_ColorTypes = async(req,res) =>{
    try{
        const data = await Colortypes_Service.Get_GemColorTypes();

        console.log("check in color type - api gateway controller");

        res.status(200).json(data);
        
    }
    catch(error){
        console.log("Error in color type controller ",error.message);

        res.status(500).json(error.message)
        
    }
}

export default {Gem_ColorTypes}