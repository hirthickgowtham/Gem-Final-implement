const {sendResponse} = require("../../utils/Response");
const {EachGemIdCheck} = require("../../utils/ExistCheck/EachGemIdCheck");
const ThumbnailCheck = require("../../utils/ExistCheck/ThumbnailCheck")

const DeleteThubnailMiddleware = async (req, res, next) =>{
    try {
        console.log("Delete Thumbnail Middleware called.");

        console.log("Request Body:", req.body);
        const {each_gem_id} = req.body;

        console.log(each_gem_id);

        if(!each_gem_id){
            return sendResponse(res, 400, false, "each_gem_id is require");
        }

        const IsEachGemIdExist = await EachGemIdCheck(each_gem_id);

        if(!IsEachGemIdExist){
            return sendResponse(res, 404, false, "Each Gem Id not found");
        }

        const IsThumbnailExist = await ThumbnailCheck(each_gem_id);

        if(!IsThumbnailExist){
            return sendResponse(res, 404, false, "Each Gem Id thumbnail not found");
        }

    } catch (error) {
        console.error("Error in DeleteThumbnailMiddleware",error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}

module.exports = {
    DeleteThubnailMiddleware
};