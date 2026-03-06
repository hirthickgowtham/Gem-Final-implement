import express from "express";

const route = express.Router();

import Login_controller from "../controller/Login.controller.js"
import Logout_controller from "../controller/Logout.controller.js"

route.post("/login",Login_controller.Admin_Login)
route.post("/logout",Logout_controller.Admin_Logout)

export default route;