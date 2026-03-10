const { sendResponse } = require("../../../../utils/Response");
const { HeroSectionDeleteService } = require("../../service/Delete/HeroSectionDelete.service");

const HeroSectionDeleteController = async (req, res) =>{
    try {

        const response = await HeroSectionDeleteService(req.body);

        return sendResponse(res, 200, true, "Hero Image Deleted Successfully", response);
        
    } catch (error) {
        console.error("Error from Hero Section Delete Controller", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}

module.exports = {
    HeroSectionDeleteController
};