const {sendResponse} = require("../../utils/Response");
const GemIdCheck = require("../../utils/ExistCheck/GemIdCheck");

const GemIdMediaMiddleware = async (req, res, next) => {
    try {

        const {gem_id, media_url} = req.body;

        if(!gem_id || !media_url) {
            return sendResponse(res, 400, false, "gem_id and media_url are required", null);
        }

        const isGemIdExist = await GemIdCheck(gem_id);

        if(!isGemIdExist) {
            return sendResponse(res, 404, false, "Gem ID not found", null);
        }

    } catch (error) {
        console.error("Error in GemIdMediaMiddleware: ", error);
        return sendResponse(res, 500, false, "Internal Server Error", null);
    }
    next();
}

module.exports = {
    GemIdMediaMiddleware
}