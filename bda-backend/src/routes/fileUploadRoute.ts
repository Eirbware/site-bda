import {Express, Request} from "express";
import isAuthentified from "../middlewares/isAuthentified";
import isAdmin from "../middlewares/isAdmin";
import multer, {memoryStorage} from "multer";
import * as fs from "fs";
import sharp from "sharp";

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/members');
    },
    filename(req: Request, file: any, callback: (error: (Error | null), filename: string) => void) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerUpload = multer({
    storage: memoryStorage(),
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
    app.post('/upload/profile-picture', isAuthentified, isAdmin, multerUpload.single('profilePicture'), async (req, res) => {
        fs.access('public/images/members', error => {
            if (error) {
                fs.mkdirSync('public/images/members');
            }
        });

        if (!req.file) {
            return res.status(400).send();
        }

        const {buffer, originalname} = req.file;
        const ref = `${Date.now()}-${originalname}.webp`;
        await sharp(buffer)
            .webp({quality: 20})
            .resize({
                width: 450,
                height: 300,
                fit: "outside"
            })
            .toFile(`public/images/members/${ref}`);

        res.status(200).json({
            success: true,
            fileName: ref
        });
    });
};