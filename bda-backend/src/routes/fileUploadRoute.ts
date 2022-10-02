import {Express, Request} from "express";
import isAuthentified from "../middlewares/isAuthentified";
import isAdmin from "../middlewares/isAdmin";
import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/members');
    },
    filename(req: Request, file: any, callback: (error: (Error | null), filename: string) => void) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerUpload = multer({
    storage: multerStorage,
    fileFilter(req: Request, file: any, callback: multer.FileFilterCallback) {
        // Get the file extension
        const extension = file.originalname.split('.').pop();

        // Check if the file is an image
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
            callback(null, true);
        } else {
            callback(new Error('The file is not an image'));
        }
    }
});

export default (app: Express) => {
    app.post('/upload/profile-picture', isAuthentified, isAdmin, multerUpload.single('profilePicture'), (req, res) => {
        res.status(200).json({
            success: true,
            // @ts-ignore
            fileName: req.file.filename
        });
    });
};