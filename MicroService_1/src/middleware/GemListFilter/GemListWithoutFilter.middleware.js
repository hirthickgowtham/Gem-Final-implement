const { sendResponse } = require('../../utils/Response');
const GemIdCheck = require('../../utils/ExistCheck/GemIdCheck');

const validationChecker = async (req,res,next) => {

    try {

        const category = req.params.category;
        const gem_id = req.params.gem_id;

        if(!category || !gem_id){
            return sendResponse(res, 400, false, "Category and gem_id parameters are required");
        }

        if(category != 1 && category != 2){
            return sendResponse(res, 400, false, "Invalid category or gem_id");
        }

        const isGemIdValid = await GemIdCheck(gem_id);

        if(isGemIdValid === false){
            return sendResponse(res, 400, false, "Invalid category or gem_id");
        }

    } catch (error) {
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}

module.exports = { validationChecker };