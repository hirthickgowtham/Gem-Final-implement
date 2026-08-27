const { sendResponse } = require("../../../../utils/Response");
const { MediaStatusGetService } = require("../../service/Get/MediaStatusGet.service");

const MediaStatusGetController = async (req, res) => {
    try {
        const { media_id } = req.params;

        if (!media_id) {
            return sendResponse(res, 400, false, "media_id parameter is required");
        }

        const result = await MediaStatusGetService(Number(media_id));

        if (!result) {
            return sendResponse(res, 404, false, `Media status not found for media_id ${media_id}`);
        }

        return sendResponse(res, 200, true, "Media status retrieved successfully", result);

    } catch (error) {
        console.error("Error in MediaStatusGetController:", error);
        return sendResponse(res, 500, false, "Internal server error in MediaStatusGetController", null, error.message);
    }
};

module.exports = { MediaStatusGetController };
