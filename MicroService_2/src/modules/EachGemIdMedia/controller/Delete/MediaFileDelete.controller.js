const { sendResponse } = require("../../../../utils/Response");
const {MediaFileDeleteService} = require("../../service/Delete/MediaFileDelete.service")

const MediaFileDeleteController = async (req, res) => {
    try {
        const media_ids = req.body.media_ids;
        
        console.log("Values in Media File Delete Controller", media_ids);

        const result = await MediaFileDeleteService(media_ids);

        return sendResponse(res, 200, true, "Media File Delete Controller", result);

    } catch (error) {
        console.log("Error in Media File Delete Controller", error);
        sendResponse(res, 500, false, "Error in Media File Delete Controller");
    }
}

module.exports = { MediaFileDeleteController };