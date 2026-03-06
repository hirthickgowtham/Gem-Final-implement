const {sendResponse} = require("../../utils/Response");
const {EachGemIdCheck} = require("../../utils/ExistCheck/EachGemIdCheck");


const ThumbnailMediaMiddleware = async (req, res, next) => {

    try {

        const {each_gem_id, Url} = req.body;

        if(!each_gem_id || !Url){
            return sendResponse(res, 400, false, "each_gem_id and Url is require");
        }

        const IsEachGemIdExist = await EachGemIdCheck(each_gem_id);

        if(!IsEachGemIdExist){
            return sendResponse(res, 404, false, "Each Gem Id not found");
        }

        
    } catch (error) {
        console.error("Error in ThumbnailMediaMiddleware");
        return sendResponse(res, 500, false, "Internal Server Error");
    }
    
    next();
}

module.exports = {
    ThumbnailMediaMiddleware
};