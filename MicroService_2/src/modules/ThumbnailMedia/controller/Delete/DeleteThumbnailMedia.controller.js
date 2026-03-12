const {sendResponse} = require("../../../../utils/Response");
const {DeleteThumbnailMediaService} = require("../../service/Delete/DeleteThumbnailMedia.service")

const DeleteThumbnailMediaController = async (req, res) =>{
    try {

        const { each_gem_id } = req.body;

        console.log(each_gem_id);

        const response = await DeleteThumbnailMediaService(each_gem_id);

        return sendResponse(res, 200, true, "Thumbnail deleted successfully", response);
        
    } catch (error) {
        console.log("Error in Delete Thumbnail Delete controller.", error);
        return sendResponse(res, 500, false, "Error in Delete Thumbnail Delete controller.");
    }
}

module.exports = {
    DeleteThumbnailMediaController
};