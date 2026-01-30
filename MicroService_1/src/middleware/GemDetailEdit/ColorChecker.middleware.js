const { sendResponse } = require('../../utils/Response');
const ColorIdCheck = require('../../utils/ExistCheck/ColorIdCheck')

const  validationChecker = async (req, res, next) => {
    try {

        const { color_id } = req.body;

        const IsColorExist = await ColorIdCheck(color_id);

        if (!IsColorExist) {
            return sendResponse(res, 400, false, null, 'Color ID does not exist');
        }

    } catch (error) {
        console.error('Error in ColorChecker middleware:', error);
        return sendResponse(res, 500, false, null, 'Internal Server Error');
    }

    next();
}


module.exports = {
    validationChecker
};

