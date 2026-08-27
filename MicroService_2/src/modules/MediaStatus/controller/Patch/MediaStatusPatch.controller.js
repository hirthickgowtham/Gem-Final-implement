const { sendResponse } = require("../../../../utils/Response");
const { MediaStatusPatchService } = require("../../service/Patch/MediaStatusPatch.service");

const ALLOWED_STATUSES = ["pending", "ready", "failed"];

const MediaStatusPatchController = async (req, res) => {
    try {
        const { media_id, status } = req.body;

        if (!media_id) {
            return sendResponse(res, 400, false, "media_id is required");
        }

        if (!status || typeof status !== "string") {
            return sendResponse(
                res,
                400,
                false,
                `status is required and must be one of: ${ALLOWED_STATUSES.join(", ")}`
            );
        }

        const normalizedStatus = status.toLowerCase().trim();

        if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
            return sendResponse(
                res,
                400,
                false,
                `Invalid status '${status}'. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`
            );
        }

        const result = await MediaStatusPatchService(Number(media_id), normalizedStatus);

        if (!result) {
            return sendResponse(res, 404, false, `Media status record not found for media_id ${media_id}`);
        }

        return sendResponse(res, 200, true, "Media status updated successfully", result);

    } catch (error) {
        console.error("Error in MediaStatusPatchController:", error);
        return sendResponse(res, 500, false, "Internal server error in MediaStatusPatchController", null, error.message);
    }
};

module.exports = { MediaStatusPatchController };
