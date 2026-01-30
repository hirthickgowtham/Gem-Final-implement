const { sendResponse } = require('../../utils/Response');
const GemIdCheck = require('../../utils/ExistCheck/GemIdCheck');
const ShapeIdCheck  = require('../../utils/ExistCheck/ShapeIdCheck');
const  ColorIdCheck  = require('../../utils/ExistCheck/ColorIdCheck');

const validationChecker = async (req,res,next) => {

    try {  

        const gem_id = Number(req.params.gem_id);
        const filter1 = req.params.filter1;
        const filter2 = req.params.filter2;
        const { value1, value2 } = req.query;

        if(!gem_id) return sendResponse(res, 400, false, "Invalid gem_id");

        if(filter1 === filter2){
            return sendResponse(res, 400, false, "Filters must be different");
        }

        const isGemIdValid = await GemIdCheck(gem_id);

        if(isGemIdValid === false){
            return sendResponse(res, 400, false, "Invalid gem_id");
        }

        const filterValues = ["shape_id", "color_id", "crt"];

        if(!filterValues.includes(filter1) || !filterValues.includes(filter2)){
            return sendResponse(res, 400, false, "Invalid filter parameters");
        }

        const isFilter1Valid = await filterExsistsChecker(filter1, value1);
        const isFilter2Valid = await filterExsistsChecker(filter2, value2);

        if(!isFilter1Valid || !isFilter2Valid){
            return sendResponse(res, 400, false, "Invalid filter values");
        }

    }
    catch (error) {
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}






// helper functions

const filterExsistsChecker = async (filter, value) => {
    
    switch (filter) {
        case "shape_id":
            const isShapeIdValid = await ShapeIdCheck(value);
            if(isShapeIdValid === false){
                return false;
            }
            return true;
        case "color_id":
            const isColorIdValid = await ColorIdCheck(value);
            if(isColorIdValid === false){
                return false;
            }
            return true;

        case "crt":
            if(Number(value) <= 0 || Number(value) > 150){
                return false;
            }
            return true;
    
        default:
            return false;
    }

}

module.exports = { validationChecker };



