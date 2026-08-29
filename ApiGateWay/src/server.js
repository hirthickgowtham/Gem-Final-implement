
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

// Allow large media files (videos/images) to stream without timing out
server.timeout = 0;              // Disable socket inactivity timeout
server.requestTimeout = 0;       // Disable request body timeout (prevents Node.js 5-min disconnect on large uploads)
server.headersTimeout = 65000;   // 65s for initial headers
server.keepAliveTimeout = 60000; // 60s keep-alive