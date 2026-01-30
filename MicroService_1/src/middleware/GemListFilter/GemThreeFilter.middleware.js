const { sendResponse } = require('../../utils/Response');
const GemIdCheck = require('../../utils/ExistCheck/GemIdCheck');
const ShapeIdCheck  = require('../../utils/ExistCheck/ShapeIdCheck');
const  ColorIdCheck  = require('../../utils/ExistCheck/ColorIdCheck');



const validationChecker = async (req,res,next) => {
    try {

        const gem_id = Number(req.params.gem_id);
        const { color_id, shape_id, crt } = req.query;

        if(!gem_id) return sendResponse(res, 400, false, "Invalid gem_id");

        if(!color_id || !shape_id || !crt){
            return sendResponse(res, 400, false, "All three filters (color_id, shape_id, crt) are required");
        }

        const isGemIdValid = await GemIdCheck(gem_id);
        const isColorIdValid = await ColorIdCheck(color_id);
        const isShapeIdValid = await ShapeIdCheck(shape_id);

        if(!isGemIdValid || !isColorIdValid || !isShapeIdValid){
            return sendResponse(res, 400, false, "Invalid gem_id, color_id or shape_id");
        }

        if( Number(crt) <= 0 || Number(crt) > 150){
            return sendResponse(res, 400, false, "Invalid crt value");
        }

    } catch (error) {
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}


module.exports = {
    validationChecker
};