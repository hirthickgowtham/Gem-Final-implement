const express = require('express'); 
const router = express.Router();

// middleware
const AddNewEachGemMiddleware = require('../../../middleware/GemDetailEdit/GemDetailEdit.middleware');
const ShapeNameEditMiddleware = require('../../../middleware/GemDetailEdit/ShapeChecker.middleware');
const ColorNameEditMiddleware = require('../../../middleware/GemDetailEdit/ColorChecker.middleware');
const RemoveSpecificGemMiddleware = require('../../../middleware/GemDetailEdit/SpecificGemCheck.middleware');
const GemTypeIdCheckerMiddleware = require('../../../middleware/GemDetailEdit/GemTypeIdChecker.middleware');
const UpdataEachGemDetailMiddleware = require('../../../middleware/GemDetailEdit/EachGemDetailUpdataChecker.middleware');
const AddNewGemMiddleware = require('../../../middleware/GemDetailEdit/NewGemChecker.middleware');
const GemDetailPatchMiddleware = require('../../../middleware/GemDetailEdit/GemDetailPatch.middleware');

// controllers
const { AddNewEachGem } = require('../controller/Post/AddNewEachGem.controller');
const { AddNewGemController } = require('../controller/Post/AddNewGem.controller');
const { ShapeNameEditController } = require('../controller/Patch/ShapeNameEdit.controller');
const { ColorNameEditController } = require('../controller/Patch/ColorNameEdit.controller');
const { AddNewColorController } = require('../controller/Post/AddNewColor.controller');
const { AddNewShapeController } = require('../controller/Post/AddNewShape.controller');
const { RemoveSpecificGemController } = require('../controller/Delete/RemoveSpecificGem.controller');
const { RemoveShapeController } = require('../controller/Delete/RemoveShape.controller');
const { RemoveColorController } = require('../controller/Delete/RemoveColor.controller');
const { RemoveGemTypeController } = require('../controller/Delete/RemoveGemType.controller');
const { UpdataEachGemDetailController } = require('../controller/Patch/UpdataEachGemDetail.controller');
const { GemDetailEditController } = require('../controller/Patch/GemDetailEdit.controller');

// Routes

//post routes
router.post('/add_each_gem', AddNewEachGemMiddleware.validationChecker, AddNewEachGem );
router.post('/add_gem', AddNewGemMiddleware.validationChecker, AddNewGemController);
router.post('/add_shape', AddNewShapeController );
router.post('/add_color', AddNewColorController );

//patch routes
router.patch('/edit_shape_name', ShapeNameEditMiddleware.validationChecker, ShapeNameEditController );
router.patch('/edit_color_name', ColorNameEditMiddleware.validationChecker, ColorNameEditController );
router.patch('/edit_each_gem_detail', UpdataEachGemDetailMiddleware.validationChecker, UpdataEachGemDetailController);
router.patch('/edit_gem_detail', GemDetailPatchMiddleware.validationChecker, GemDetailEditController);

// Delete routes
router.delete('/remove_specific_gem', RemoveSpecificGemMiddleware.validationChecker, RemoveSpecificGemController);
router.delete('/remove_shape', ShapeNameEditMiddleware.validationChecker, RemoveShapeController);
router.delete('/remove_color', ColorNameEditMiddleware.validationChecker, RemoveColorController);
router.delete('/remove_gem_type', GemTypeIdCheckerMiddleware.validationChecker,RemoveGemTypeController);

module.exports = router