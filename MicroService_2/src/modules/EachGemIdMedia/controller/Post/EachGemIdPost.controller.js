
const {sendResponse} = require("../../../../utils/Response");
const { EachGemIdPostService } = require("../../service/Post/EachGemIdPost.service");

const EachGemIdPostController = async (req, res) =>{
    try{
        
        const {each_gem_id, values} = req.body;

        console.log("Each Gem Id Post Controller", {each_gem_id, values});

        const result = await EachGemIdPostService(each_gem_id, values);
    
    
        sendResponse(res, 200, true, "Each Gem Id Post Controller", result);

    }catch(error){
        console.log("Error in Each Gem Id Post Controller", error);
        sendResponse(res, 500, false, "Error in Each Gem Id Post Controller");
    }

}

module.exports = {EachGemIdPostController};