const {EachGemIdCheck} = require('../../utils/ExistCheck/EachGemIdCheck');
const {sendResponse} = require('../../utils/Response');

const validationChecker  = async (req, res, next) => {
    try {

        const each_gem_id = req.params.each_gem_id;

        if(!each_gem_id){
            return sendResponse(res, 400, false, "Valid parameter required");
        }

        const IsGemIdExist = await EachGemIdCheck(each_gem_id);

        if(!IsGemIdExist){
            return sendResponse(res, 400, false, "Valid parameter required");
        }

    }catch (error){
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}

module.exports = {
    validationChecker
};