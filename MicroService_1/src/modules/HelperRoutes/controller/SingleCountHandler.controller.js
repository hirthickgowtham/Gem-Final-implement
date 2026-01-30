const { sendResponse } = require('../../../utils/Response');
const   ShapeIdCheck  = require('../../../utils/ExistCheck/ShapeIdCheck');
const   ColorIdCheck  = require('../../../utils/ExistCheck/ColorIdCheck');
const {shapeIdFilterCount, ColorIdFilterCount, CrtFilterCount} = require('../service/SingleCountHandler.service');

const SingleCountHandler = async (req, res) => {
    try {

        const gem_id = Number(req.params.gem_id);
        const category = Number(req.params.category);
        const { filter, value } = req.query;

        if(filter === "shape_id"){
            const isShapeIdValid = await ShapeIdCheck(Number(value));
            if(isShapeIdValid === false){
                return sendResponse(res, 400, false, "Invalid shape_id value");
            }

            const data = await shapeIdFilterCount(gem_id, category, Number(value));

            return sendResponse(res, 200, true, "Valid shape_id value", data);
        }

        if(filter === "color_id"){
            const isColorIdValid = await ColorIdCheck(Number(value));
            if(isColorIdValid === false){
                return sendResponse(res, 400, false, "Invalid color_id value");
            }

            const data = await ColorIdFilterCount(gem_id, category, Number(value));

            return sendResponse(res, 200, true, "Valid color_id value", data);
        }

        if(filter === "crt"){
            if(Number(value) <= 0 || Number(value) > 150){
                return sendResponse(res, 400, false, "Invalid CRT value");
            }

            const data = await CrtFilterCount(gem_id, category, Number(value));

            return sendResponse(res, 200, true, "Valid CRT value", data);

        }

        return sendResponse(res, 400, false, "Invalid filter parameter");

        
        
    } catch (error) {
        console.error("Error in CountHandler:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}


module.exports = {
    SingleCountHandler
};