const { sendResponse } = require("../../utils/Response");
const GemIdCheck = require("../../utils/ExistCheck/GemIdCheck");
const {LotNumberCheck} = require("../../utils/ExistCheck/LotNumberCheck");
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
            'shape_id'
        ];
        
        const keys = Object.keys(gemDetails).filter(k =>
            allowedFields.includes(k)
        );

        if (keys.length === 0) {
            return sendResponse(res, 400, false, "At least one field must be provided to update: lot_number, crt, number_of_gems, gem_id, category, color_id, shape_id, description");
        }

        if ('lot_number' in gemDetails && !gemDetails.lot_number) {
            return sendResponse(res, 400, false, "lot_number cannot be empty");
        }

        if ('gem_id' in gemDetails && !gemDetails.gem_id) {
            return sendResponse(res, 400, false, "gem_id cannot be empty");
        }

        if(gemDetails.gem_id){
            const IsGemIdValid = await GemIdCheck(gemDetails.gem_id);

            if(!IsGemIdValid){
                return sendResponse(res, 400, false, "Invalid gem_id provided");
            }
        }

        if(gemDetails.lot_number){
            const IsLotNumberExist = await LotNumberCheck(gemDetails.lot_number);

            if(!IsLotNumberExist){
                return sendResponse(res, 400, false, "Invalid lot_number provided");
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