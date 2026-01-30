const { GemListFilterService} = require('../service/GemListFilter.service');
const {sendResponse} = require('../../../utils/Response');

const GemsFilterController = async (req,res) => {
    try {

        const category = req.params.category;
        const gem_id = req.params.gem_id;
        const {page, limit} = req.query;

        const data = await GemListFilterService(category, gem_id, Number(page) || 1, Number(limit) || 10);
        return sendResponse(res, 200, true, `Gems filtered by category: ${category} and gem_id: ${gem_id}`, data);

    } catch (error) {

        console.error("Error in GemsFilterController:", error);
        return sendResponse(res, 500, false, "Internal Server Error");

    }
};

module.exports = {
    GemsFilterController
};