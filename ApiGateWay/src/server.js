
import "./config/dotenv.config.js"

import app from "./config/app.config.js"
import envload from "./load/env.load.js";
import AWSLoad from "./load/AWS.load.js";




envload();
AWSLoad();


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server runing on port ${PORT}`);
    
})