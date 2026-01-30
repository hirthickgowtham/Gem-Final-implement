const { sendResponse } = require('../../../../utils/Response');
const { RemoveGemTypeService } = require('../../service/Delete/RemoveGemType.service');

const RemoveGemTypeController = async (req, res) => {
    try {

        const { gem_type_id } = req.body;

        const data = await RemoveGemTypeService(gem_type_id);

        return sendResponse(res, 200, true, "Gem type removed successfully", data); 

    }catch (error) {    
        console.log("Error in RemoveGemTypeController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }
};

module.exports = { RemoveGemTypeController };