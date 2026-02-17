import PublicRoute from "../modules/PublicUserRoutes/routes/Public.route.js";


export default function registerRoutes(app){
    app.use("/api/public",PublicRoute)
}