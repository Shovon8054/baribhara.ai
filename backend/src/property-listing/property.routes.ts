import { Router } from "express";
import multer from "multer";
import path from "path";
import propertyController from "./property.controller";
import requireAuth from "../middleware/authMiddleware";


const router = Router();

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/properties");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// File Filter
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


router.post(
  "/",
  requireAuth,
  upload.array("images", 5),
  propertyController.createProperty
);


router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Property route is working",
  });
});

export default router;