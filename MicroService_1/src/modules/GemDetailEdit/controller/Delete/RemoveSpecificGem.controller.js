const { sendResponse } = require('../../../../utils/Response');
const { RemoveSpecificGemService } = require('../../service/Delete/RemoveSpecificGem.service');

const RemoveSpecificGemController = async (req, res) => {
    try {
        const { each_gem_id } = req.body;

        const data = await RemoveSpecificGemService(each_gem_id);

        return sendResponse(res, 200, true, "Gem removed successfully", data);


    }catch (error) {
        console.log("Error in RemoveSpecificGemController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }   
};

module.exports = { RemoveSpecificGemController };