const { sendResponse } = require('../../../../utils/Response');
const { ColorNameEditService } = require('../../service/Patch/ColorNameEdit.service');


const ColorNameEditController = async (req, res) => {
    try {
        const { color_id, color_name } = req.body;

        const data = await ColorNameEditService(color_id, color_name);

        return sendResponse(res, 200, true, "Color name edited successfully", data);
        
    } catch (error) {
        console.log("Error in ColorNameEditController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }
}

module.exports = { ColorNameEditController };