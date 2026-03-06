const express = require("express");
const router = express.Router();


//middleware
const { GemIdMediaMiddleware } = require("../../../middleware/GemIdMedia/GemIdMedia.meddileware");

// contorller
const { GemIdMediaController } = require("../controller/Patch/GemIdMedia.controller");


// routes

// patch

router.patch("/reset_gem_id_media", GemIdMediaMiddleware, GemIdMediaController)



module.exports = router;