const express = require('express'); // import express
const router = express.Router(); // create router instance

// middlewares
const GemListWthoutFilterMiddleware = require('../../../middleware/GemListFilter/GemListWithoutFilter.middleware');
const GemSingleFilterMiddleware = require('../../../middleware/GemListFilter/GemSingleFilter.middleware');
const GemDoubleFilterMiddleware = require('../../../middleware/GemListFilter/GemDoubleFilter.middleware');
const GemThreeFilterMiddleware = require('../../../middleware/GemListFilter/GemThreeFilter.middleware');

// controllers
const { GemsFilterController } = require('../controller/GemListWthoutFilter.controller');
const { GemSingleFilterController } = require('../controller/GemSingleFilter.controller');
const { GemDoubleFilterController } = require('../controller/GemDoubleFilter.controller');
const { GemThreeFilterController } = require('../controller/GemThreeFilter.controller');

// routes
router.get('/gem_List/:gem_id/:category', GemListWthoutFilterMiddleware.validationChecker, GemsFilterController);
router.get('/single_filter_gem/:gem_id/:category', GemSingleFilterMiddleware.validationChecker, GemSingleFilterController);
router.get('/double_filter_gem/:gem_id/category_1/:filter1/:filter2', GemDoubleFilterMiddleware.validationChecker, GemDoubleFilterController);
router.get('/three_filter_gem/:gem_id/category_1', GemThreeFilterMiddleware.validationChecker, GemThreeFilterController);


// export router
module.exports = router;