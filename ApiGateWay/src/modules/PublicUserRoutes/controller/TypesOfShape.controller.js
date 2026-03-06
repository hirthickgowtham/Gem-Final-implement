import GemShape_Service from "../services/TypesOfShape.service.js"

const Gem_Shape = async(req,res)=>{
    try{
        const data = await GemShape_Service.Get_GemShapes();
        console.log("check in type of shapes controller - api gateway");

        res.status(200).json(data);
        
    }
    catch(error){
        console.log("Error in api gateway for ",error.message);
        res.status(500).json(error.message);
        
    }
}

export default {Gem_Shape}