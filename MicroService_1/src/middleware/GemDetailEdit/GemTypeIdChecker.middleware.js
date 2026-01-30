const { sendResponse } = require("../../utils/Response");
const GemIdCheck = require("../../utils/ExistCheck/GemIdCheck")

const validationChecker = async (req, res, next) => {
    try {

        const { gem_type_id } = req.body;

        if (!gem_type_id) {
            return sendResponse(res, 400, false, null, "gem_type_id is required");
        }

        const isGemExist = await GemIdCheck(gem_type_id);
        if (!isGemExist) {
            return sendResponse(res, 404, false, null, "gem_type_id does not exist");
        }
        
    } catch (error) {
        console.log("Error in GemTypeIdChecker middleware:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }

    next();
}


module.exports = { validationChecker };