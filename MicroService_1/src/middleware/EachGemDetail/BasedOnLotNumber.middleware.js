const {LotNumberCheck} = require('../../utils/ExistCheck/LotNumberCheck');
const {sendResponse} = require('../../utils/Response');

const validationChecker  = async (req, res, next) => {
    try {

        const lot_number = req.params.lot_number;

        if(!lot_number){
            return sendResponse(res, 400, false, "Valid parameter required");
        }

        const IsLotNumberExist = await LotNumberCheck(lot_number);

        if(!IsLotNumberExist){
            return sendResponse(res, 400, false, "Valid parameter required");
        }

    }catch (error){
        console.error("Error in validationChecker middleware:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }

    next();
}


module.exports = {
    validationChecker
};