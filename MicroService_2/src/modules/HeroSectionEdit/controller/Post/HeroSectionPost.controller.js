const { sendResponse } = require("../../../../utils/Response");
const { HeroSectionPostService } = require("../../service/Post/HeroSectionPost.service");


const HeroSectionPostController = async (req, res) =>{
    try {

        const response = await HeroSectionPostService(req.body);

        return sendResponse(res, 200, true, "Hero Section running successfully", response);
        
    } catch (error) {
        console.error("Error from Hero Section Post Controller", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}

module.exports = {
    HeroSectionPostController
};

