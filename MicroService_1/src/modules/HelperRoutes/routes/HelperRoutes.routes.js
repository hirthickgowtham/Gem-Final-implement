const express = require('express');
const router = express.Router();


// middleware
const GemSingleFilterMiddleware  = require('../../../middleware/GemListFilter/GemSingleFilter.middleware');
const GemDoubleFilterMiddleware  = require('../../../middleware/GemListFilter/GemDoubleFilter.middleware');
const GemThreeFilterMiddleware  = require('../../../middleware/GemListFilter/GemThreeFilter.middleware');

// controllers
const { SingleCountHandler } = require('../controller/SingleCountHandler.controller');
const { DoubleCountHandler } = require('../controller/DoubleCountHandler.controller');
const { ThreeCountHandler } = require('../controller/ThreeCountHandler.controller');
const { ShapeController, ColorController } = require('../controller/FilterAvaliableValue.controller');


// routes
router.get('/single_filter/:gem_id/:category', GemSingleFilterMiddleware.validationChecker, SingleCountHandler);
router.get('/double_filter/:gem_id/category_1/:filter1/:filter2', GemDoubleFilterMiddleware.validationChecker, DoubleCountHandler);
router.get('/three_filter/:gem_id/category_1', GemThreeFilterMiddleware.validationChecker, ThreeCountHandler);
router.get('/shape_type', ShapeController);
router.get('/color_type', ColorController);

module.exports = router;