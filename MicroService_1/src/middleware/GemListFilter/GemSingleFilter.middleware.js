const { sendResponse } = require('../../utils/Response');
const GemIdCheck = require('../../utils/ExistCheck/GemIdCheck');

const validationChecker = async (req,res,next) => {

    try {

        const category = Number(req.params.category);
        const gem_id = Number(req.params.gem_id);
        const { filter} = req.query;


        if(!category || !gem_id){
            return sendResponse(res, 400, false, "Category and gem_id parameters are required");
        }

        if(category != 1 && category != 2){
            return sendResponse(res, 400, false, "Invalid category or gem_id");
        }

        if(category === 2 && (filter == "shape_id" || filter == "color_id")) {
            return sendResponse(res, 400, false, `Filtering by ${filter} is not allowed for category 2`);
        }

        
        const isGemIdValid = await GemIdCheck(gem_id);

        if(isGemIdValid === false){
            return sendResponse(res, 400, false, "Invalid category or gem_id");
        }

        
    } catch (error) {
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
        
    }

    next();
}





module.exports = { validationChecker };