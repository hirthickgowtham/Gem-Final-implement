const express = require('express'); // import express module
const routeRegister = require("../utils/RegisterRouters") // import route registration utility


const app = express(); // create an express application instance

app.use(express.json({ limit: "20mb" })); // Middleware to parse JSON requests
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Middleware to parse URL-encoded requests



app.get('/', (req, res) => {
    res.send('✅MicroService_2 is running');
});

// register application routes
routeRegister(app); 


module.exports = app; // export the configured app instance