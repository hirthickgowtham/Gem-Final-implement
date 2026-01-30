const { sendResponse } = require('../../../utils/Response');
const { ShapeBasedFilter, ColorBasedFilter, CrtBasedFilter } = require('../service/GemSingleFilter.service');
const ShapeIdCheck  = require('../../../utils/ExistCheck/ShapeIdCheck');
const ColorIdCheck  = require('../../../utils/ExistCheck/ColorIdCheck');




const GemSingleFilterController = async (req,res) => {
    try {

        const category = Number(req.params.category);
        const gem_id = Number(req.params.gem_id);
        const {page, limit, filter, value} = req.query;


        if(category === 1){
            if(filter === "shape_id"){

                if(!ShapeIdCheck(value)){
                    return sendResponse(res, 400, false, "Invalid shape_id provided");
                }
            
                const data = await ShapeBasedFilter(value, category, gem_id, page || 1, limit || 10);
                return sendResponse(res, 200, true, "Shape based filtered gems fetched successfully", data);
            }

            if(filter === "color_id"){

                if(!ColorIdCheck(value)){
                    return sendResponse(res, 400, false, "Invalid color_id provided");
                }

                const data = await ColorBasedFilter(value, category, gem_id, page || 1, limit || 10);
                return sendResponse(res, 200, true, "Color based filtered gems fetched successfully", data);
            }

            if(filter === "crt"){

                if(Number(value) <= 0 || Number(value) > 150){
                    return sendResponse(res, 400, false, "Invalid crt value provided");
                }

                const data = await CrtBasedFilter(Number(value), category, gem_id, page || 1, limit || 10);
                return sendResponse(res, 200, true, "Crt based filtered gems fetched successfully", data);

            }

        }

        if(category === 2){
            if(filter === "crt"){
                if(Number(value) <= 0 || Number(value) > 150){
                    return sendResponse(res, 400, false, "Invalid crt value provided");
                }
                const data = await CrtBasedFilter(Number(value), category, gem_id, page || 1, limit || 10);
                return sendResponse(res, 200, true, "Crt based filtered gems fetched successfully", data);
            }
        }

        return sendResponse(res, 400, false, "Invalid filter or category provided");

        
    } catch (error) {
        console.error("Error in GemSingleFilterController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}

module.exports = {
    GemSingleFilterController
};


