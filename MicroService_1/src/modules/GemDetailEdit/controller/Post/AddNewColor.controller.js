const { sendResponse } = require('../../../../utils/Response');
const { AddNewColorService } = require('../../service/Post/AddNewColor.service');

const AddNewColorController = async (req, res) => {
    try {
        
        const { color_name } = req.body;

        if (!color_name) {
            return sendResponse(res, 400, false, "color_name is required");
        }

        const data = await AddNewColorService(color_name);

        return sendResponse(res, 200, true, "Color added successfully", data);
        
    } catch (error) {
        console.error("Error in AddNewColorController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");

    }
};


module.exports = {
    AddNewColorController
};