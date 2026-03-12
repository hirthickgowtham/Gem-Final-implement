import Get_gem_types_Service from "../services/Get_gem_types.service.js"


const gem_types = async(req,res)=>{

    try{
        const result = await Get_gem_types_Service.getGem();

        console.log("success!!",result);

        res.status(200).json({result});
    }
    catch(e){
        console.log('Error in API gateway',e.message);

        return res.status(500).json(e);
        
    }

}


export default {gem_types}