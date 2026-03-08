import AddShape_Service from "../../services/Post/AddShape.service.js";

const AddShape = async(req,res)=>{
    try{
        const { shape } = req.body;

        const data = await AddShape_Service.AddShapeService(shape);

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


export default {AddShape}