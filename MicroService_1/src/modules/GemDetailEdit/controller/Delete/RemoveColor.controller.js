const { sendResponse } = require('../../../../utils/Response');
const { RemoveColorService } = require('../../service/Delete/RemoveColor.service');

const RemoveColorController = async (req, res) => {
    try {

        const { color_id } = req.body;

        const data = await RemoveColorService(color_id);

        return sendResponse(res, 200, true, "Color removed successfully", data);

    }catch (error) {    
        console.log("Error in RemoveColorController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }
};

module.exports = { RemoveColorController };