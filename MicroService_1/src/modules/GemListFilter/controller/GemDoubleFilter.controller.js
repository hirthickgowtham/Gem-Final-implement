const { sendResponse } = require('../../../utils/Response');
const { ShapeColorFilter, ShapeCrtFilter, ColorCrtFilter } = require('../service/GemDoubleFilter.service');

const GemDoubleFilterController = async (req, res) => {

    try {

        const gem_id = Number(req.params.gem_id);
        const filter1 = req.params.filter1;
        const filter2 = req.params.filter2;
        const { page, limit, value1, value2 } = req.query;

        if(shapeColorcheck(filter1, filter2)){
            if(filter1 === "shape_id"){
                const data = await ShapeColorFilter(gem_id, filter1, filter2, value1, value2, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ShapeColorFilter(gem_id, filter2, filter1, value2, value1, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        if(shapeCrtcheck(filter1, filter2)){
            if(filter1 === "shape_id"){
                const data = await ShapeCrtFilter(gem_id, filter1, filter2, value1, value2, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ShapeCrtFilter(gem_id, filter2, filter1, value2, value1, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        if(colorCrtcheck(filter1, filter2)){
            if(filter1 === "color_id"){
                const data = await ColorCrtFilter(gem_id, filter1, filter2, value1, value2, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ColorCrtFilter(gem_id, filter2, filter1, value2, value1, page, limit);
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        return sendResponse(res, 400, false, "Invalid filter combination");

    } catch (error) {
        console.error("Error in GemDoubleFilterController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}




// helper functions

const shapeColorcheck = (filter1, filter2) => {
    if((filter1 === "shape_id" && filter2 === "color_id") || (filter1 === "color_id" && filter2 === "shape_id")){
        return true;
    }   
    return false;
}


const shapeCrtcheck = (filter1, filter2) => {  
    if((filter1 === "shape_id" && filter2 === "crt") || (filter1 === "crt" && filter2 === "shape_id")){
        return true;
    }   
    return false;
}

const colorCrtcheck = (filter1, filter2) => {  
    if((filter1 === "color_id" && filter2 === "crt") || (filter1 === "crt" && filter2 === "color_id")){
        return true;
    }
    return false;
}

module.exports = { GemDoubleFilterController };