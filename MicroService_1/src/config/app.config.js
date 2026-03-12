const express = require('express'); // import express module
const routeRegister = require("../utils/RegisterRouters") // import route registration utility


const app = express(); // create an express application instance

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests



app.get('/', (req, res) => {
    res.send('✅MicroService_1 is running');
});


// register application routes
routeRegister(app); 


// export the configured app instance
module.exports = app;