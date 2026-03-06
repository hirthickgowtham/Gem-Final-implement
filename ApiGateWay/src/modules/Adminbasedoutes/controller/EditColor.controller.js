import Edit_Color_Service from "../services/EditColor.service.js"

const Edit_Color = async(req,res)=>{
    try{
        const {color_id,color_name} = req.body;

        const data = await Edit_Color_Service.Edit_Color_Service(color_id,color_name);

        return res.status(200).json({
            message:data
        })
    }
    catch(error){
        res.status(500).json({
            error:error.response.data
        })
    }
}

export default {Edit_Color}