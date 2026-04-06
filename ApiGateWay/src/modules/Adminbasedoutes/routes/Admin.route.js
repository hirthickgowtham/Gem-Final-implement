import express from "express";
import { uploadGemFiles } from "../../../middleware/multer.middleware.js";
import DeleteMediaFilesAws from "../../../utils/MediaFilesAws/DeleteMediaFilesAws.js";
import multer from "multer";
import RandomName from "../../../utils/RandomName.js";
import UploadMediaFilesAws from "../../../utils/MediaFilesAws/UploadMediaFilesAws.js";
import {updategemFiles} from "../../../middleware/Multerfields.middleware.js"

const storage = multer.memoryStorage();
const upload = multer({ storage });


import AddEachGemController from "../controller/Post/AddEachGem.controller.js"
import AddShapeController from "../controller/Post/AddShape.controller.js"
import AddColorController from "../controller/Post/AddColor.controller.js";
import AddGemController from "../controller/Post/AddGem.controller.js";
import AddEachGemThumNailController from "../controller/Post/AddEachGemThumNail.controller.js";
import AddHeroSectionContoller from "../controller/Post/AddHeroSection.contoller.js";
import AddEachGemMediaController from "../controller/Post/AddEachGemMedia.controller.js";

import EditShapeController from "../controller/Patch/EditShape.controller.js";
import EditColorController from "../controller/Patch/EditColor.controller.js";
import EditEachGemDetailsController from "../controller/Patch/EditEachGemDetails.controller.js";
import EditHeroSectionController from "../controller/Patch/EditHeroSection.controller.js";
import EditGemDetailsController from "../controller/Patch/EditGemDetails.controller.js";


import RemoveEachGemController from "../controller/Delete/RemoveSpecificGem.controller.js";
import RemoveShapeController from "../controller/Delete/RemoveShape.controller.js";
import RemoveColorController from "../controller/Delete/RemoveColor.controller.js";
import RemoveGemTypeController from "../controller/Delete/RemoveGemType.controller.js";
import RemoveEachGemMediaController from "../controller/Delete/RemoveEachGemMedia.controller.js";
import RemoveEachGemThumNailController from "../controller/Delete/RemoveEachGemThumNail.controller.js";
import RemoveHeroSectionController from "../controller/Delete/RemoveHeroSection.controller.js";


const route = express.Router();




route.post("/add-each-gem",uploadGemFiles,AddEachGemController.AddEachGem)
route.post("/add-shape",AddShapeController.AddShape);
route.post("/add-color",AddColorController.AddColor);
route.post("/add-gem",uploadGemFiles,AddGemController.AddGem);
route.post("/add-each-gem-thumbnail",uploadGemFiles,AddEachGemThumNailController.AddEachGemThumNail);
route.post("/add-hero-section",upload.single("image"),AddHeroSectionContoller.AddHeroSection);
route.post("/add-each-gem-media",uploadGemFiles,AddEachGemMediaController);
//Still Add Gem file upload is pending 


route.patch("/edit-shape",EditShapeController.Edit_Shape)
route.patch("/edit-color",EditColorController.Edit_Color)

//TO handle image for edit each gem details route and edit gem detail route
route.patch("/edit-each-gem-details",updategemFiles,EditEachGemDetailsController.Edit_Each_Gem_Details)
route.patch("/edit-gem-details",upload.single("image"),EditGemDetailsController.Edit_Gem_Details)

//Each Gem detail edit is pending in point of file recieving and handling
// Gem Type edit is pending

route.patch("/edit-hero-section",upload.single("image"),EditHeroSectionController.EditHeroSection)



//All delete routes are pending
route.delete("/remove-each-gem",RemoveEachGemController.RemoveEachGem)
route.delete("/remove-shape",RemoveShapeController.RemoveShape);
route.delete("/remove-color",RemoveColorController.RemoveColor);
route.delete("/remove-gem-type",RemoveGemTypeController.RemoveGemType)
route.delete("/remove-each-gem-media",RemoveEachGemMediaController.RemoveEachGemMedia)
route.delete("/remove-each-gem-thumbnail",RemoveEachGemThumNailController.RemoveEachGemThumNail)
route.delete("/remove-hero-section",RemoveHeroSectionController.RemoveHeroSection)


route.post("/check",upload.single("image"),async(req,res)=>{
  
  console.log(req.file);
  const filename = RandomName();
  const filetype = req.file.mimetype.split("/")[0];
  const buffer = req.file.buffer;


  console.log(filename,filetype,buffer);

    // const response =await UploadMediaFilesAws(filetype,filename,buffer);
  
    
    // const response = await DeleteMediaFilesAws("6a4b01e8f6ed87273cfc47efa30a8d2e17de83daa24eab9a93ca2927a7ce01ae");
    console.log(response);
    return res.status(200).json({
        message:"Admin route working fine",
        response
    })
})

export default route;