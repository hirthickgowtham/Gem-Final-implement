const { sendResponse } = require("../../utils/Response");
const GemIdCheck = require("../../utils/ExistCheck/GemIdCheck");

const validationChecker = async (req, res, next) => {
    try {

        const { gem_id } = req.body;

        if (!gem_id) {
            return sendResponse(res, 400, false, 'gem_id is required.');
        }

        const result = await GemIdCheck(gem_id);

        if (!result) {
            return sendResponse(res, 404, false, 'Gem with the provided gem_id does not exist.');
        }
        
    } catch (error) {
        console.error('Error in GemDetailEditMiddleware:', error);
        sendResponse(res, 500, false, 'An error occurred while processing the request.');
    }

    next();
}

module.exports = {
    validationChecker
};