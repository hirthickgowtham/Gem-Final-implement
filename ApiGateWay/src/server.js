
import "./config/dotenv.config.js"

import app from "./config/app.config.js"
import envload from "./load/env.load.js";
import AWSLoad from "./load/AWS.load.js";
import loadKafka from "./load/kafka.load.js";




envload();
AWSLoad();
loadKafka();


const PORT = process.env.PORT;


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


server.timeout = 600000;