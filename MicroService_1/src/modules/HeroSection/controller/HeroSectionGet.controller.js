const { sendResponse } = require('../../../utils/Response');
const { HeroSectionGetService } = require("../service/HerosectionGet.service");

const HeroSectionGetController = async (req, res) => {
    try {

        const response = await HeroSectionGetService();

        return sendResponse(res, 200, true, "Hero Section Get run successfully", response);
        
    } catch (error) {
        console.error("Error in HeroSectionGetController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}

module.exports = { HeroSectionGetController };