const { sendResponse } = require('../../../utils/Response');
const { ThreeFilterCountHandler } = require('../service/ThreeCountHandler.service');

const ThreeCountHandler = async (req, res) => {
    try {

        const gem_id = Number(req.params.gem_id);
        const {shape_id, color_id, crt} =  req.query;

        const data = await ThreeFilterCountHandler(gem_id, Number(shape_id), Number(color_id), Number(crt));

        return sendResponse(res, 200, true, "Successfull filter based shape_id, color_id and crt", data);

    }catch (error) {
        console.error("Error in ThreeCountHandler:", error);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
}


module.exports = {
    ThreeCountHandler
};