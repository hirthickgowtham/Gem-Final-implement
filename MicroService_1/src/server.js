// load environment variables from .env file
require('dotenv').config();

// import app configuration
const app = require('./config/app.config');


// load modules
const loadEnv = require('./load/env.load');
const { loadDB } = require('./load/db.load');
const connectRedis = require('./load/redis.load');


// load functions calls

loadEnv(); // check and load environment variables
loadDB(); // check database connection
connectRedis(); // connect to Redis

const port = process.env.PORT || 3000;  

// start the server
app.listen(port, () => {
    console.log(`✅ MicroService_1 is running on port ${port}`);
});

