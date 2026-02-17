import Get_gem_types_Service from "../services/Get_gem_types.service.js"


const gem_types = async(req,res)=>{

    try{
        const result = await Get_gem_types_Service.getGem();

        console.log("success!!",result);

        res.send({result});
    }
    catch(e){
        console.log('Error in API gateway');
        
    }

}


export default {gem_types}