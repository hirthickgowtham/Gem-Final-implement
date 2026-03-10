const express = require("express");
const router = express.Router();



// middlewares
const { HeroSectionPostMiddleware } = require("../../../middleware/HeroSection/HeroSectionPost.middleware");
const { HeroSectionPatchMiddleware } = require("../../../middleware/HeroSection/HeroSectionPatch.middleware");
const { HeroSectionDeleteMiddleware } = require("../../../middleware/HeroSection/HeroSectionDelete.middleware");

// controllers
const { HeroSectionPostController } = require("../controller/Post/HeroSectionPost.controller");
const { HeroSectionPatchController } = require("../controller/Patch/HeroSectionPatch.controller");
const { HeroSectionDeleteController } = require("../controller/Delete/HeroSectionDelete.controller");


// routers
router.post("/add_hero_image", HeroSectionPostMiddleware, HeroSectionPostController);
router.patch("/edit_hero_section", HeroSectionPatchMiddleware, HeroSectionPatchController);
router.delete("/delete_hero_image", HeroSectionDeleteMiddleware, HeroSectionDeleteController);


module.exports = router;