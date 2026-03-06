import express from "express";
import { uploadGemFiles } from "../../../middleware/multer.middleware.js";


import AddGemController from "../controller/AddGem.controller.js"
import AddShapeController from "../controller/AddShape.controller.js"
import AddColorController from "../controller/AddColor.controller.js";

import EditShapeController from "../controller/EditShape.controller.js";
import EditColorController from "../controller/EditColor.controller.js";


const route = express.Router();




route.post("/add-gem",uploadGemFiles,AddGemController.AddGem)
route.post("/add-shape",AddShapeController.AddShape);
route.post("/add-color",AddColorController.AddColor)


route.patch("/edit-shape",EditShapeController.Edit_Shape)
route.patch("/edit-color",EditColorController.Edit_Color)


export default route;