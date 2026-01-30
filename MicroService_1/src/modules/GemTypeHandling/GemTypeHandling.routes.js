const express = require('express');
const route = express.Router();

// Import controller
const controller = require('./GemTypeHandling.controller');


// Define route to get gem types
route.get('/gem_types', controller.getGemTypes);


// Export the route
module.exports = route;