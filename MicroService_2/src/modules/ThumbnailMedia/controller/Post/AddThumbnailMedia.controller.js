const {sendResponse} = require("../../../../utils/Response");
const {AddThumbnailMediaService} = require("../../service/Post/AddThumbnailMedia.service")

const AddThumbanilMediaController = async (req,res) =>{
    try {
        const {each_gem_id, Url} = req.body;

        console.log(each_gem_id, Url);

        const response = await AddThumbnailMediaService(each_gem_id, Url);

        return sendResponse(res,201,true,"Thumbnail added successfully", response);

    } catch (error) {
        console.log("Error in Add Thumbnail Post Controller", error);
        sendResponse(res, 500, false, "Error in Add Thumbnail Post Controller")

    }
}

module.exports = {
    AddThumbanilMediaController
};