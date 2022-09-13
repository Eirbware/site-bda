import {authenticate, logout} from "../controllers/authenticationController";
import {Express} from "express";
import isAuthentified from "../middlewares/isAuthentified";

export default (app: Express) => {
    app.route("/authenticate")
        .get(authenticate);

    app.route("/logout")
        .get(isAuthentified, logout);
};