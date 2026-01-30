const { sendResponse } = require('../../../../utils/Response');
const { RemoveShapeService } = require('../../service/Delete/RemoveShape.service');

const RemoveShapeController = async (req, res) => {
    try {
        const { shape_id } = req.body;

        const data = await RemoveShapeService(shape_id);
        return sendResponse(res, 200, true, "Shape removed successfully", data);
        
    }catch (error) {    
        console.log("Error in RemoveShapeController:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }
};

module.exports = { RemoveShapeController };