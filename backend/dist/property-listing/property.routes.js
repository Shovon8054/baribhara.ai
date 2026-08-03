"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const property_controller_1 = __importDefault(require("./property.controller"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
// Storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/properties");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path_1.default.extname(file.originalname));
    },
});
// File Filter
const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
router.post("/", authMiddleware_1.default, upload.array("images", 5), property_controller_1.default.createProperty);
router.get("/", property_controller_1.default.getAllProperties);
// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Property route is working",
//   });
// });
exports.default = router;
