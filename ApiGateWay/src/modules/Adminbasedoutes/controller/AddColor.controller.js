import AddColor_Service from "../services/AddColor.service.js";

const AddColor = async(req,res)=>{
    try{
        const { color } = req.body;

        const data = await AddColor_Service.AddColorService(color);

        console.log(data);
        
        return res.status(200).json({
            message:data
        })
    }
    catch(error){
         return res.status(500).json({
            message:error
        })
    }
}

export default {AddColor}