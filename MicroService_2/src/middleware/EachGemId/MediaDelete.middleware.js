const {sendResponse} = require("../../utils/Response");
const { MediaIdCheck } = require("../../utils/ExistCheck/MediaIdCheck");

const mediaDeleteMiddleware = async (req, res, next) => {

    try {
        const {media_ids} = req.body;
    
        if(!media_ids || !Array.isArray(media_ids) || media_ids.length === 0){
            return sendResponse(res, 400, false, "Media IDs are required and should be a non-empty array");
        }
        
        next();
    } catch (error) {
        console.error("Error in MediaDelete Middleware", error);
        return sendResponse(res, 500, false, "Internal Server Error in MediaDelete Middleware");
    }
    
}

module.exports = {
    mediaDeleteMiddleware
}