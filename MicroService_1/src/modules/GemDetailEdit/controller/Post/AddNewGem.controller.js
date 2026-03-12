const  {sendResponse} = require("../../../../utils/Response");
const { AddNewGemService } = require("../../service/Post/AddNewGem.service");

const AddNewGemController = async (req, res) => {
        try {
            const gemDetails = req.body;

            const result = await AddNewGemService(gemDetails);
            
            return sendResponse(res, 201, true, "Gem added successfully", result);
            
        } catch (error) {
            console.error("Error in AddNewGemController:", error);
            return sendResponse(res, 500, false, "Internal Server Error");
        }
}

module.exports = {
    AddNewGemController
}