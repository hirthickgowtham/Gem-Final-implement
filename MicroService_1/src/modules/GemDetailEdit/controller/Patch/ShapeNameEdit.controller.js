const { sendResponse } = require('../../../../utils/Response');
const { ShapeNameEditService } = require('../../service/Patch/ShapeNameEdit.service');


const ShapeNameEditController = async (req, res) => {
    try {
        const { shape_id, shape_name } = req.body;

        const data = await ShapeNameEditService(shape_id, shape_name);

        return sendResponse(res, 200, true, "Shape name edited successfully", data);
        
    } catch (error) {
        console.log("Error in ShapeNameEditController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }
}

module.exports = { ShapeNameEditController };