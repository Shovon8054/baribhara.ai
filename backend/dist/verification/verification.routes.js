import { Router } from "express";
import verificationController from "./verification.controller.js";
import requireAuth from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import { uploadNidPdf } from "../middleware/upload.js";
const router = Router();
/**
 * User routes (Authenticated via requireAuth)
 */
// POST /api/verification — Submit NID details & PDF for verification
router.post("/", requireAuth, uploadNidPdf, (req, res) => verificationController.submit(req, res));
// POST /api/verification/submit (alias)
router.post("/submit", requireAuth, uploadNidPdf, (req, res) => verificationController.submit(req, res));
// GET /api/verification or GET /api/verification/status — Get current user verification status
router.get("/", requireAuth, (req, res) => verificationController.getStatus(req, res));
router.get("/status", requireAuth, (req, res) => verificationController.getStatus(req, res));
// GET /api/verification/history — Get attempt history
router.get("/history", requireAuth, (req, res) => verificationController.getHistory(req, res));
/**
 * Admin routes (Protected by requireAuth + requireAdmin)
 */
// GET /api/verification/admin/all — List all submissions
router.get("/admin/all", requireAuth, requireAdmin, (req, res) => verificationController.getAll(req, res));
// PATCH /api/verification/admin/:id/review — Review and change status (VERIFIED, REJECTED, MANUAL_REVIEW)
router.patch("/admin/:id/review", requireAuth, requireAdmin, (req, res) => verificationController.review(req, res));
export default router;
