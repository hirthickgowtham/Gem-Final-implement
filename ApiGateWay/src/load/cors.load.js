import cors from "cors";
import corsConfig from "../config/cors.config";

export default function loadcors(app){
    app.use(cors(corsConfig)),

    app.use("*",cors(corsConfig))
}

