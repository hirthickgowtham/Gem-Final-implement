const { sendResponse } = require("../../../../utils/Response");
const { HeroSectionPatchService } = require("../../service/Patch/HeroSectionPatch.service");


const HeroSectionPatchController = async (req, res) => {
    try {

        console.log(req.body);

        const response = await HeroSectionPatchService(req.body);

        return sendResponse(res, 200, true, "Hero Section Image Edited Successfully", response);
        
    } catch (error) {
        console.error("Error from Hero section Patch Controller", error);
        return sendResponse(res, 500, false, "Internal server Error");
    }
}

module.exports = {
    HeroSectionPatchController
};