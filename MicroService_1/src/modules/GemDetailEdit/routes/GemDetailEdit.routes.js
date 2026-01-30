const express = require('express'); 
const router = express.Router();

// middleware
const AddNewGemMiddleware = require('../../../middleware/GemDetailEdit/GemDetailEdit.middleware');
const ShapeNameEditMiddleware = require('../../../middleware/GemDetailEdit/ShapeChecker.middleware');
const ColorNameEditMiddleware = require('../../../middleware/GemDetailEdit/ColorChecker.middleware');
const RemoveSpecificGemMiddleware = require('../../../middleware/GemDetailEdit/SpecificGemCheck.middleware');
const GemTypeIdCheckerMiddleware = require('../../../middleware/GemDetailEdit/GemTypeIdChecker.middleware');
const UpdataEachGemDetailMiddleware = require('../../../middleware/GemDetailEdit/EachGemDetailUpdataChecker.middleware');

// controllers
const { AddNewGem } = require('../controller/Post/AddNewGem.controller');
const { ShapeNameEditController } = require('../controller/Patch/ShapeNameEdit.controller');
const { ColorNameEditController } = require('../controller/Patch/ColorNameEdit.controller');
const { AddNewColorController } = require('../controller/Post/AddNewColor.controller');
const { AddNewShapeController } = require('../controller/Post/AddNewShape.controller');
const { RemoveSpecificGemController } = require('../controller/Delete/RemoveSpecificGem.controller');
const { RemoveShapeController } = require('../controller/Delete/RemoveShape.controller');
const { RemoveColorController } = require('../controller/Delete/RemoveColor.controller');
const { RemoveGemTypeController } = require('../controller/Delete/RemoveGemType.controller');
const { UpdataEachGemDetailController } = require('../controller/Patch/UpdataEachGemDetail.controller');

// Routes

//post routes
router.post('/add_gem', AddNewGemMiddleware.validationChecker, AddNewGem );
router.post('/add_shape', AddNewShapeController );
router.post('/add_color', AddNewColorController );

//patch routes
router.patch('/edit_shape_name', ShapeNameEditMiddleware.validationChecker, ShapeNameEditController );
router.patch('/edit_color_name', ColorNameEditMiddleware.validationChecker, ColorNameEditController );
router.patch('/edit_each_gem_detail', UpdataEachGemDetailMiddleware.validationChecker, UpdataEachGemDetailController);

// Delete routes
router.delete('/remove_specific_gem', RemoveSpecificGemMiddleware.validationChecker, RemoveSpecificGemController);
router.delete('/remove_shape', ShapeNameEditMiddleware.validationChecker, RemoveShapeController);
router.delete('/remove_color', ColorNameEditMiddleware.validationChecker, RemoveColorController);
router.delete('/remove_gem_type', GemTypeIdCheckerMiddleware.validationChecker,RemoveGemTypeController);

module.exports = router