const express = require('express');
const router = express.Router();


// middlewares
const { EachGemIdPostMiddleware } = require("../../../middleware/EachGemId/EachGemId.middleware");
const { mediaDeleteMiddleware } = require("../../../middleware/EachGemId/MediaDelete.middleware");

// controllers
const { EachGemIdPostController } = require('../controller/Post/EachGemIdPost.controller');
const { MediaFileDeleteController } = require('../controller/Delete/MediaFileDelete.controller');

// routes


//post
router.post('/each_gem_id_media_upload',EachGemIdPostMiddleware, EachGemIdPostController);



// Delete
router.delete('/each_gem_id_media_delete', mediaDeleteMiddleware , MediaFileDeleteController);


module.exports = router;
