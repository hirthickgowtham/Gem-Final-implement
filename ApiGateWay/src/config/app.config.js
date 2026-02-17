import express, { urlencoded } from "express";
import routeRegister from "../utils/registerRouters.js"
const app=express();

//In build middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


routeRegister(app);
//Home req route
app.get("/",(req,res)=>{
    res.send("Get request received ");
    console.log("API gateway running Fine...");

})




export default app;