const { sendResponse } = require('../../../../utils/Response');
const { GemDetailEditService } = require('../../service/Patch/GemDetailEdit.service');

const GemDetailEditController = async (req, res) => {
    try {
        
        const { gem_id} = req.body;

        const result  = await GemDetailEditService(gem_id, req.body);
        
        return sendResponse(res, 200, true, 'Gem details updated successfully.', result);

    } catch (error) {
        console.error('Error in GemDetailEditController:', error);
        sendResponse(res, 500, false, 'An error occurred while processing the request.');
    }
}

module.exports = {
    GemDetailEditController
};