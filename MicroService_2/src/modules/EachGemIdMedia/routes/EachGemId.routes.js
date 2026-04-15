const express = require('express');
const router = express.Router();


// middlewares
const { EachGemIdPostMiddleware } = require("../../../middleware/EachGemId/EachGemId.middleware");
const { mediaDeleteMiddleware } = require("../../../middleware/EachGemId/MediaDelete.middleware");
const { mediaEditMiddleware } = require("../../../middleware/EachGemId/MediaEdit.middleware");

// controllers
const { EachGemIdPostController } = require('../controller/Post/EachGemIdPost.controller');
const { MediaFileDeleteController } = require('../controller/Delete/MediaFileDelete.controller');
const { MediaFileEditController } = require("../controller/Patch/MediaFileEdit.controller");

// routes


// post
router.post('/each_gem_id_media_upload',EachGemIdPostMiddleware, EachGemIdPostController);

// Patch
router.patch('/each_gem_media_edit', mediaEditMiddleware, MediaFileEditController);

// Delete
router.delete('/each_gem_id_media_delete', mediaDeleteMiddleware , MediaFileDeleteController);


module.exports = router;
