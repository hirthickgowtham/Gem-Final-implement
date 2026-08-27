const { sendResponse } = require("../../../../utils/Response");
const { MediaStatusPostService } = require("../../service/Post/MediaStatusPost.service");

const ALLOWED_STATUSES = ["pending", "ready", "failed"];

const MediaStatusPostController = async (req, res) => {
    try {
        const { media_id, status = "pending" } = req.body;

        if (!media_id) {
            return sendResponse(res, 400, false, "media_id is required");
        }

        const normalizedStatus = typeof status === "string" ? status.toLowerCase().trim() : "pending";

        if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
            return sendResponse(
                res,
                400,
                false,
                `Invalid status '${status}'. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`
            );
        }

        const result = await MediaStatusPostService(Number(media_id), normalizedStatus);
        return sendResponse(res, 201, true, "Media status created/initialized successfully", result);

    } catch (error) {
        console.error("Error in MediaStatusPostController:", error);
        return sendResponse(res, 500, false, "Internal server error in MediaStatusPostController", null, error.message);
    }
};

module.exports = { MediaStatusPostController };
