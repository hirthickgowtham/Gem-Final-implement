const {sendResponse} = require("../../../../utils/Response");
const {GemIdMediaService} = require("../../service/Patch/GemIdMedia.service");

const GemIdMediaController = async (req, res) => {
    try {

        const {gem_id, media_url} = req.body;   

        console.log("Received data in GemIdMediaController: ", {gem_id, media_url});

        const result = await GemIdMediaService(gem_id, media_url);

        return sendResponse(res, 200, "Gem ID media stored successfully", result);
        
    } catch (error) {
        console.error("Error in GemIdMediaController: ", error);
        sendResponse(res, 500, "Internal Server Error", null);
    }
}

module.exports = {
    GemIdMediaController
}