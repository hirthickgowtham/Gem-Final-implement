const { sendResponse } = require('../../../../utils/Response');
const { AddNewGemService } = require('../../service/Post/AddNewEachGem.service');


const AddNewEachGem = async (req, res) => {

    try {
        const gemDetails = req.body;

        const data = await AddNewGemService(gemDetails);

        return sendResponse(res, 201, true, "Gem added successfully", data);

    } catch(error){
        console.error("Error in AddNewGem controller:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

};


module.exports = {
    AddNewEachGem
};
