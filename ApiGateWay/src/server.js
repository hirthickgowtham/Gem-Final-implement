
import dotenv from "dotenv";

import app from "./config/app.config.js"
dotenv.config();


import envload from "./load/env.load.js";



envload();

const PORT = process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log(`Server runing on port ${PORT}`);
    
})