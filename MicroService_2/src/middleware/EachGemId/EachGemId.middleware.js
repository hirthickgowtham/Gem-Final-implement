const {sendResponse} = require("../../utils/Response");
const { EachGemIdCheck } = require("../../utils/ExistCheck/EachGemIdCheck");

const EachGemIdPostMiddleware = async (req, res, next) =>{
    try{
        const EachGemId = req.body.each_gem_id;
        const values = req.body.values;
        
    
        if(!EachGemId){
            sendResponse(res, 400, false, "Each Gem Id is required");
            return;
        }

        if(!values){
            sendResponse(res, 400, false, "Values are required");
            return;
        }

        const EachGemIdExist = await EachGemIdCheck(EachGemId);

        if(!EachGemIdExist){
            sendResponse(res, 400, false, "Each Gem Id does not exist");
            return;
        }


    }catch(error){
        console.log("Error in Each Gem Id Post Middleware", error);
        sendResponse(res, 500, false, "Error in Each Gem Id Post Middleware");
    }
    
    next();
}

module.exports = {EachGemIdPostMiddleware};