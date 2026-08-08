import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import editProfileController from "./editProfile.controller.js";
import requireAuth from "../../middleware/authMiddleware.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();

// =========================
// Multer Storage
// =========================

const UPLOAD_DIR = path.join(process.cwd(), "src", "uploads", "profiles");

// Ensure the upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// =========================
// File Filter
// =========================

const fileFilter: multer.Options["fileFilter"] = (
    req,
    file,
    cb
) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            )
        );
    }
};

// =========================
// Multer
// =========================

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// =========================
// Update Profile
// =========================

router.patch(
    "/",
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
        upload.single("profile_image")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    editProfileController.updateProfile
);

export default router;