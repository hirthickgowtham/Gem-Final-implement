const { sendResponse } = require('../../utils/Response');
const { EachGemIdCheck } = require('../../utils/ExistCheck/EachGemIdCheck');

const validationChecker = async (req, res, next) => {
    try {

        const { each_gem_id } = req.body;

        if(!each_gem_id){    
            return sendResponse(res, 400, false,  "each_gem_id is required");
        }

        const gemExists = await EachGemIdCheck(each_gem_id);

        if(!gemExists){
            return sendResponse(res, 404, false, "Gem with the provided each_gem_id does not exist");
        }

    } catch (error) {
        console.log("Error in SpecificGemCheck middleware:", error);
        return sendResponse(res, 500, false, null, "Internal Server Error");
    }

    next();
};


module.exports = {
    validationChecker
};

