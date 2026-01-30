
// MicroService_1/src/utils/registerRouters.js

module.exports = (app) => {
    
    app.use('/api', require('../modules/GemTypeHandling/GemTypeHandling.routes'));  // Register GemTypeHandling routes
    app.use('/api', require('../modules/GemListFilter/routes/GemListFilter.routes'));  // Register GemListFilter routes
    app.use('/api/helper', require('../modules/HelperRoutes/routes/HelperRoutes.routes'));  // Register HelperRoutes routes
    app.use('/api/each_gem_detail', require('../modules/EachGemDetail/routes/EachGemDetail.routes'));  // Register EachGemDetail routes
    app.use('/api/edit', require('../modules/GemDetailEdit/routes/GemDetailEdit.routes')) // Register GemDetailEdit routes

};
