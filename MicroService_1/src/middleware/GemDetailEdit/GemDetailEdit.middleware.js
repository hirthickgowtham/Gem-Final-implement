const { sendResponse } = require("../../utils/Response");

const validationChecker = (req, res, next) => {

    try {

        const gemDetails = req.body;
        const gemDetails = req.body;


        if (!variableChecker(gemDetails)) {
            return sendResponse(res, 400, false, "All fields are required: lot_number, crt, number_of_gems, gem_id, category, color_id, shape_id, description, price." );
        }

    }catch (error) {
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();

};



// helper function

const variableChecker = (gemDetails) => {
    const { lot_number, crt, number_of_gems, gem_id, category, color_id, shape_id, description, price} = gemDetails;
    if (!lot_number || !crt || !number_of_gems || !gem_id || !category || !color_id || !shape_id || !description || !price) {
        return false;
    }

    return true;
};

module.exports = {
    validationChecker
};