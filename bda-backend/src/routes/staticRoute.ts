import express, {Express} from "express";

export default (app: Express) => {
    // Serve the public/ folder
    app.use(express.static('public'));
};