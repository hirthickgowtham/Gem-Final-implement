const { sendResponse } = require('../../../utils/Response');
const { ShapeColorCount, ShapeCrtCount, ColorCrtCount } = require('../service/DoubleCountHandler.service');

const DoubleCountHandler = async (req, res) => {

    try {

        const gem_id = Number(req.params.gem_id);
        const filter1 = req.params.filter1;
        const filter2 = req.params.filter2;
        const { value1, value2 } = req.query;


        if(shapeColorcheck(filter1, filter2)){
            if(filter1 === "shape_id"){
                const data = await ShapeColorCount(gem_id, Number(value1), Number(value2));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ShapeColorCount(gem_id, Number(value2), Number(value1));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        if(shapeCrtcheck(filter1, filter2)){
            if(filter1 === "shape_id"){
                const data = await ShapeCrtCount(gem_id, Number(value1), Number(value2));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ShapeCrtCount(gem_id, Number(value2), Number(value1));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        if(colorCrtcheck(filter1, filter2)){
            if(filter1 === "color_id"){
                const data = await ColorCrtCount(gem_id, Number(value1), Number(value2));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }else{
                const data = await ColorCrtCount(gem_id, Number(value2), Number(value1));
                return sendResponse(res, 200, true, "Double filter gem fetched successfully", data);
            }
        }

        return sendResponse(res, 400, false, "Invalid filter combination");

    }catch (error) {
        console.error("Error in DoubleCountHandler:", error);
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



module.exports = {
    DoubleCountHandler
};