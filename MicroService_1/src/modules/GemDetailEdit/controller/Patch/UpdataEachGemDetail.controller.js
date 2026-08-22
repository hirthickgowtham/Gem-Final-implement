const { sendResponse } = require('../../../../utils/Response');
const { UpdataEachGemDetailService } = require('../../service/Patch/UpdataEachGemDetail.service');


const UpdataEachGemDetailController = async (req, res) => {
    try {

        const {each_gem_id} = req.body;
        const payload = req.body;

        console.log(payload)
        const data = await UpdataEachGemDetailService(each_gem_id, payload);

        sendResponse(res, 200, true, "Each gem detail updated successfully");
        
    } catch (error) {
        console.error("Error in UpdataEachGemDetailController:", error);
        sendResponse(res, 500, false, error.detail || "Internal Server Error");
    }
}

module.exports = { UpdataEachGemDetailController };