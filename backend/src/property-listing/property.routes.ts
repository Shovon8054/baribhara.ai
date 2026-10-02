import { Router } from "express";
import multer from "multer";
import propertyController from "./property.controller.js";
import requireAuth from "../middleware/authMiddleware.js";



const router = Router();

// In-memory storage for Cloudinary stream upload
const storage = multer.memoryStorage();

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


import { Request, Response, NextFunction } from "express";

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.array("images", 5)(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          status: "fail",
          message: "Maximum 5 images allowed.",
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "fail",
          message: "Each image size cannot exceed 5MB.",
        });
      }
      return res.status(400).json({
        status: "fail",
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        status: "fail",
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

router.post(
  "/",
  requireAuth,
  handleUpload,
  propertyController.createProperty
);

router.get(
  "/",
  propertyController.getAllProperties
);

router.get(
  "/search",
  propertyController.searchProperties
);


router.delete(
  "/:id",
  requireAuth,
  propertyController.deleteProperty
);
// router.get("/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Property route is working",
//   });
// });

export default router;
