import { Router } from "express";
import multer from "multer";
import editProfileController from "./editProfile.controller.js";
import requireAuth from "../../middleware/authMiddleware.js";
const router = Router();
// In-memory storage for Cloudinary stream upload
const storage = multer.memoryStorage();
// =========================
// File Filter
// =========================
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, PNG and WEBP images are allowed"));
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
router.patch("/", requireAuth, (req, res, next) => {
    upload.single("profile_image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        }
        else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, editProfileController.updateProfile);
export default router;
