
const {sendResponse} = require("../../../../utils/Response");
const { MediaFileEditService } = require("../../service/Patch/MediaFileEdit.service") 

const MediaFileEditController = async (req, res) =>{

    try{
        
        const {values} = req.body;

        const result = await MediaFileEditService(values);
        
        sendResponse(res, 200, true, "Media Id Patch Controller", result);

    }catch(error){
        console.log("Error in Media Id Patch Controller", error);
        sendResponse(res, 500, false, "Error in Media Id Patch Controller");
    }

}

module.exports = {MediaFileEditController};