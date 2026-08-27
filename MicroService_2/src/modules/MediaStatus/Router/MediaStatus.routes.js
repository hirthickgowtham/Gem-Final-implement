const express = require('express');
const router = express.Router();

// Controllers
const { MediaStatusPostController } = require('../controller/Post/MediaStatusPost.controller');
const { MediaStatusGetController } = require('../controller/Get/MediaStatusGet.controller');
const { MediaStatusPatchController } = require('../controller/Patch/MediaStatusPatch.controller');
const { MediaStatusDeleteController } = require('../controller/Delete/MediaStatusDelete.controller');

// Routes
router.post('/media_status', MediaStatusPostController);
router.get('/media_status/:media_id', MediaStatusGetController);
router.patch('/media_status', MediaStatusPatchController);
router.delete('/media_status/:media_id', MediaStatusDeleteController);

module.exports = router;
