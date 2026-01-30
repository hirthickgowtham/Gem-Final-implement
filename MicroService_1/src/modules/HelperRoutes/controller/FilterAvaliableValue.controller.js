const { sendResponse } = require('../../../utils/Response');
const { ShapeValueHandler, ColorValueHandler } = require('../service/FilterAvaliableValue.service');

const ShapeController = async (req, res) => {
    try {

        const data = await ShapeValueHandler();
        return sendResponse(res, 200, true, "Successfully fetched shape values", data);
        
    } catch (error) {
        console.error("Error in ShapeController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};

const ColorController = async (req, res) => {
    try {

        const data = await ColorValueHandler();
        return sendResponse(res, 200, true, "Successfully fetched color values", data);

    } catch (error) {
        console.error("Error in ShapeController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};


module.exports = {
    ShapeController,
    ColorController
};