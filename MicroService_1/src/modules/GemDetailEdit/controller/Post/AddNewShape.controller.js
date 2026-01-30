const { sendResponse } = require('../../../../utils/Response');
const { AddNewShapeService } = require('../../service/Post/AddNewShape.service');

const AddNewShapeController = async (req, res) => {
    try {

        const { shape_name } = req.body;

        if (!shape_name) {
            return sendResponse(res, 400, false, "shape_name is required");
        }

        const data = await AddNewShapeService(shape_name);  

        return sendResponse(res, 200, true, "Shape added successfully", data);
        
    } catch (error) {
        console.error("Error in AddNewShapeController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");

    }
};


module.exports = {
    AddNewShapeController
};