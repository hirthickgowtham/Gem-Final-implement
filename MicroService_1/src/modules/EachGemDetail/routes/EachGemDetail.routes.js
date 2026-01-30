const express = require('express'); // import express
const router = express.Router(); // create router instance


// middlewares
const BasedOnEachGemIdMiddleware = require('../../../middleware/EachGemDetail/BasedOnEachGemId.middleware');
const BasedOnLotNumberMiddleware = require('../../../middleware/EachGemDetail/BasedOnLotNumber.middleware');

// controllers
const { BasedOnEachGemIdController } = require('../controller/BasedOnEachGemId.controller');
const { BasedOnLotNumberController } = require('../controller/BasedOnLotNumber.controller');


// routes
router.get('/based_on_gem_id/:each_gem_id', BasedOnEachGemIdMiddleware.validationChecker, BasedOnEachGemIdController);
router.get('/based_on_lot_number/:lot_number', BasedOnLotNumberMiddleware.validationChecker, BasedOnLotNumberController);


module.exports = router; // export the router