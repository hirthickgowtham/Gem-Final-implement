const { sendResponse } = require("../../utils/Response");
const GemIdCheck = require("../../utils/ExistCheck/GemIdCheck");
const {EachGemIdCheck} = require("../../utils/ExistCheck/EachGemIdCheck");
const ColorIdCheck = require("../../utils/ExistCheck/ColorIdCheck");
const ShapeIdCheck = require("../../utils/ExistCheck/ShapeIdCheck");

const validationChecker = async (req, res, next) => {
    try {
        
        const gemDetails = req.body;

        const allowedFields = [
            'lot_number',
            'gem_id',
            'crt',
            'number_of_gems',
            'description',
            'category',
            'color_id',
            'shape_id',
            'price'
        ];
        
        const keys = Object.keys(gemDetails).filter(k =>
            allowedFields.includes(k)
        );

        if (keys.length === 0) {
            return sendResponse(res, 400, false, "At least one field must be provided to update: lot_number, crt, number_of_gems, gem_id, category, color_id, shape_id, description, price");
        }

        if(!gemDetails.each_gem_id){
            return sendResponse(res, 400, false, "each_gem_id cannot be updated");
        }

        if(gemDetails.each_gem_id){
            const IsEachGemIdValid = await EachGemIdCheck(gemDetails.each_gem_id);

            if(!IsEachGemIdValid){
                return sendResponse(res, 400, false, "Invalid each_gem_id provided");
            }
        }

        if(gemDetails.gem_id){
            const IsGemIdValid = await GemIdCheck(gemDetails.gem_id);

            if(!IsGemIdValid){
                return sendResponse(res, 400, false, "Invalid gem_id provided");
            }
        }

        if(gemDetails.color_id){
            const IsColorIdValid = await ColorIdCheck(gemDetails.color_id);

            if(!IsColorIdValid){
                return sendResponse(res, 400, false, "Invalid color_id provided");
            }
        }

        if(gemDetails.shape_id){
            const IsShapeIdValid = await ShapeIdCheck(gemDetails.shape_id);

            if(!IsShapeIdValid){
                return sendResponse(res, 400, false, "Invalid shape_id provided");
            }
        }

    } catch (error) {
        console.error("Error in EachGemDetailUpdataChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
        
    }

    next();
}

module.exports = {
    validationChecker
};