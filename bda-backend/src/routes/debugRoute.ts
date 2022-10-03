import {Express} from "express";
import {debug} from "../controllers/debugController";
import isAdmin from "../middlewares/isAdmin";
import isAuthentified from "../middlewares/isAuthentified";

export default (app: Express) => {
    app.route("/debug")
        .get(isAuthentified, isAdmin, debug);
}