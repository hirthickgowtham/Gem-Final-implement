import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import routeRegister from "../utils/registerRouters.js"
import loadcors from "../load/cors.load.js";
const app=express();


loadcors(app)
//In build middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



routeRegister(app);
//Home req route
app.get("/",(req,res)=>{
    res.send("Get request received ");
    console.log("API gateway running Fine...");

})




export default app;