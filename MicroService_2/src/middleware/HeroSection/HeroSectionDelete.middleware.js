const { sendResponse } = require("../../utils/Response");
const HeroSectionChecker = require("../../utils/ExistCheck/HeroIdCheck");


const HeroSectionDeleteMiddleware = async (req, res , next) =>{
    try {
        const HeroId  = req.body.HeroId;

        console.log(HeroId);

        if(!HeroId){
            return sendResponse(res, 400, false, "Hero ID is requied");
        }

        const IsHeroIdExist = await HeroSectionChecker(HeroId);

        if(!IsHeroIdExist){
            return sendResponse(res, 400, false, "Hero Id is not Exist");
        }

    } catch (error) {
        console.error("Error form Hero Section Delete Middleware", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}


module.exports = {
    HeroSectionDeleteMiddleware
}