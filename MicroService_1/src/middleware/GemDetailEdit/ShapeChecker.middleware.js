const { sendResponse } = require('../../utils/Response');
const ShapeIdCheck = require('../../utils/ExistCheck/ShapeIdCheck')

const validationChecker = async (req, res, next) => {
    try {

        const { shape_id } = req.body;

        const IsShapeExist = await ShapeIdCheck(shape_id);

        if (!IsShapeExist) {
            return sendResponse(res, 400, false, null, 'Shape ID does not exist');
        }

    } catch (error) {
        console.error('Error in ShapeChecker middleware:', error);
        return sendResponse(res, 500, false, null, 'Internal Server Error');
    }

    next();
}


module.exports = {
    validationChecker
};

