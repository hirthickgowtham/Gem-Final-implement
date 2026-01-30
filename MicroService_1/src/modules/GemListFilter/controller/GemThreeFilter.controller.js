const { sendResponse } = require("../../../utils/Response");
const { ThreeFilter } = require("../service/GemThreeFilter.service");


const GemThreeFilterController = async (req, res) => {

    try{
        const gem_id = Number(req.params.gem_id);
        const { color_id, shape_id, crt, page, limit } = req.query;

        const data = await ThreeFilter(gem_id, Number(color_id), Number(shape_id), Number(crt), page || 1, limit || 10);


        return sendResponse(res, 200, true, "Three filter gem fetched successfully", data);

    }catch (error){
        console.error("Error in GemThreeFilterController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

}

module.exports = {
    GemThreeFilterController
};