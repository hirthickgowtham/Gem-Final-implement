import ThreeFilterCount_Service from "../../services/FilterCountService/Three_FilterCount.service.js"

const ThreeFilter_Count = async(req,res)=>{
    try{

        const gem_id = Number(req.params.gem_id);
        const {shape_id, color_id, crt} =  req.query;

        const data = await ThreeFilterCount_Service.Get_ThreeFilter_Count(gem_id,shape_id,color_id,crt);
        
        console.log("check in three filter controller - api gateway ");

        res.status(200).json(data);
        
    }
    catch(error){
         console.log("error in three filter controller - api gateway ",error.message);
         res.status(500).json(error.message);
    }
}


export default {ThreeFilter_Count}