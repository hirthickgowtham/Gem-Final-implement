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

// Check
router.post('/each_gem_id_media_check', async (req, res) => {
    try {
        const { media_ids } = req.body;
        if (!media_ids || !Array.isArray(media_ids) || media_ids.length === 0) {
            return res.status(400).json({ success: false, message: "Media IDs are required and should be a non-empty array" });
        }
        const { MediaIdCheck } = require("../../../utils/ExistCheck/MediaIdCheck");
        const allExist = await MediaIdCheck(media_ids);
        return res.status(200).json({ success: true, exists: allExist });
    } catch (error) {
        console.error("Error in check media route:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// Delete by type
router.delete('/delete_each_gem_media_by_type', async (req, res) => {
    try {
        const { each_gem_id, media_type } = req.body;
        if (!each_gem_id || !media_type) {
            return res.status(400).json({ success: false, message: "each_gem_id and media_type are required" });
        }
        const pool = require('../../../../config/db.config');
        
        // Find existing records first to allow file cleanup in API Gateway
        const findQuery = `SELECT * FROM media_table WHERE each_gem_id = $1 AND media_type = $2`;
        const { rows: existingRows } = await pool.query(findQuery, [each_gem_id, media_type]);
        
        // Delete records
        const deleteQuery = `DELETE FROM media_table WHERE each_gem_id = $1 AND media_type = $2 RETURNING *`;
        const { rows: deletedRows } = await pool.query(deleteQuery, [each_gem_id, media_type]);
        
        return res.status(200).json({ success: true, deleted: deletedRows, existing: existingRows });
    } catch (error) {
        console.error("Error in delete_each_gem_media_by_type:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
