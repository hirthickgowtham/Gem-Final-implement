const { sendResponse } = require("../../utils/Response");

const HeroSectionPostMiddleware = (req, res, next) =>{
    try {

        const {title, description, image_url} = req.body;
        
        if(!image_url){
            return sendResponse(res, 400, false, "Image Url not found");
        }
        
    } catch (error) {
        console.error("Error from Hero Section Post middleware", error);
        return sendResponse(res, 500, false, "Hero Section Post Middleware");
    }

    next();
}

module.exports = {
    HeroSectionPostMiddleware
};