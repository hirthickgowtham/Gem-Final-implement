const { sendResponse } = require("../../../../utils/Response");
const { MediaStatusDeleteService } = require("../../service/Delete/MediaStatusDelete.service");

const MediaStatusDeleteController = async (req, res) => {
    try {
        const { media_id } = req.params;

        if (!media_id) {
            return sendResponse(res, 400, false, "media_id parameter is required");
        }

        const result = await MediaStatusDeleteService(Number(media_id));

        if (!result) {
            return sendResponse(res, 404, false, `Media status record not found for media_id ${media_id}`);
        }

        return sendResponse(res, 200, true, "Media status deleted successfully", result);

    } catch (error) {
        console.error("Error in MediaStatusDeleteController:", error);
        return sendResponse(res, 500, false, "Internal server error in MediaStatusDeleteController", null, error.message);
    }
};

module.exports = { MediaStatusDeleteController };
