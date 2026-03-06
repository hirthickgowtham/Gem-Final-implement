const express = require("express");
const router = express.Router();



// controller
const {AddThumbanilMediaController} = require("../controller/Post/AddThumbnailMedia.controller");
const { DeleteThumbnailMediaController } = require("../controller/Delete/DeleteThumbnailMedia.controller");


// middleware
const { ThumbnailMediaMiddleware } = require("../../../middleware/ThumbnailMedia/ThumbnailMedia.middleware")
const {DeleteThubnailMiddleware} = require("../../../middleware/ThumbnailMedia/DeleteThumbnail.middleware");

// routes


// Post
router.post("/add_thumbnail_gem", ThumbnailMediaMiddleware, AddThumbanilMediaController);


// Delete
router.delete("/delete_thumbnail_gem", DeleteThubnailMiddleware, DeleteThumbnailMediaController);

module.exports = router;

