import PublicRoute from "../modules/PublicUserRoutes/routes/Public.route.js";
import AuthRoute from "../modules/Authentication/routes/Auth.route.js"
import AdminRoute from "../modules/Adminbasedoutes/routes/Admin.route.js"

//Authmiddleware
// import VerifyTokenMiddleware from "../middleware/AuthMiddleware/VerifyToken.middleware.js";

export default function registerRoutes(app){
    app.use("/api/public",PublicRoute)
    app.use("/api/auth",AuthRoute);
    app.use("/api/admin",AdminRoute)
}