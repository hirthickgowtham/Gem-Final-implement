const express = require('express');
const router = express.Router();


// controller
const { HeroSectionGetController } = require("../controller/HeroSectionGet.controller");



router.get("/hero_images", HeroSectionGetController);


module.exports = router;