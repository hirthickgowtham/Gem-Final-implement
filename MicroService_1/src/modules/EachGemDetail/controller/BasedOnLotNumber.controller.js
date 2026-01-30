const { sendResponse } = require('../../../utils/Response');
const { BasedOnLotNumberService } = require('../service/BasedOnLotNumber.service');

const BasedOnLotNumberController = async (req, res) => {
    try {

        const lot_number = req.params.lot_number;

        const data = await BasedOnLotNumberService(lot_number);

        if (data.length === 0) {
            return sendResponse(res, 404, false, "No data found for the provided Lot Number");
        }

        return sendResponse(res, 200, true, "Lot Number received", { data });

    } catch (error) {
        console.error("Error in BasedOnLotNumberController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};

module.exports = {
    BasedOnLotNumberController
};