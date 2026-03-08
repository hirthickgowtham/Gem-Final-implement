import Edit_Shape_Service from "../../services/Patch/EditShape.service.js"

const Edit_Shape = async(req,res)=>{
    try{
        const {shape_id,shape_name} = req.body;

        const data = await Edit_Shape_Service.Edit_Shape_Service(shape_id,shape_name)

        return res.status(200).json({
            messsage:data
        })

    }
    catch(error){
        console.log(error.message);
        
        return res.status(200).json({
            messsage:data
        })
    }
}

export default {Edit_Shape}