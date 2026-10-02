import multer from "multer";
// In-memory storage for streaming directly to Cloudinary or processing
const storage = multer.memoryStorage();
// Allowed file types: PDFs are required for NID documents, also allow images as fallback
const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];
const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type (${file.mimetype}). Please upload a valid PDF document (or JPEG/PNG/WEBP).`));
    }
};
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit
    },
    fileFilter,
});
/**
 * Flexible middleware that accepts an uploaded file with field name
 * 'nid_pdf', 'document', or 'file' and attaches it to req.file.
 */
export const uploadNidPdf = (req, res, next) => {
    const uploadFields = upload.fields([
        { name: "nid_pdf", maxCount: 1 },
        { name: "document", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]);
    uploadFields(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds the 10MB limit.",
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message || "File upload error",
            });
        }
        const files = req.files;
        if (files) {
            if (files["nid_pdf"] && files["nid_pdf"][0]) {
                req.file = files["nid_pdf"][0];
            }
            else if (files["document"] && files["document"][0]) {
                req.file = files["document"][0];
            }
            else if (files["file"] && files["file"][0]) {
                req.file = files["file"][0];
            }
        }
        next();
    });
};
export const uploadDocument = uploadNidPdf;
export default upload;
