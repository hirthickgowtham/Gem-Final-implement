const { sendResponse } = require('../../../utils/Response');
const { BasedOnEachGemIdService } = require('../service/BasedOnEachGemId.service');

const BasedOnEachGemIdController = async (req, res) => {
    try {

        const each_gem_id = Number(req.params.each_gem_id);

        const data = await BasedOnEachGemIdService(each_gem_id);

        if (data.length === 0) {
            return sendResponse(res, 404, false, "No data found for the provided Each Gem ID");
        }
        return sendResponse(res, 200, true, "Each Gem ID received", { data });

    }catch (error) {
        console.error("Error in BasedOnEachGemIdController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};


module.exports = {
    BasedOnEachGemIdController
};


