const { sendResponse } = require('../../utils/Response');

const validationChecker = (req, res, next) =>{
    try {

        const {gem_name, gem_division} = req.body;

        if (!gem_name || !gem_division) {
            return sendResponse(res, 400, false, "gem_name and gem_division are required");
        }

    } catch (error) {
        console.error("Error in NewGemChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}

module.exports = {
    validationChecker
};