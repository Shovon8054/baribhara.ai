import { Router } from "express";
import adminVerificationController from "./adminVerification.controller.js";
import requireAuth from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/adminMiddleware.js";

const router = Router();

// All routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireAdmin as any);

// GET /api/admin/verifications — List submissions (filter by ?status=MANUAL_REVIEW)
router.get("/", (req, res) => adminVerificationController.getVerifications(req, res));

// GET /api/admin/verifications/:id/document — Stream NID PDF inline (backend proxy)
router.get("/:id/document", (req, res) =>
  adminVerificationController.streamDocument(req, res)
);

// GET /api/admin/verifications/:id — View single submission details
router.get("/:id", (req, res) =>
  adminVerificationController.getVerificationById(req, res)
);

// PATCH /api/admin/verifications/:id — Approve or Reject verification
router.patch("/:id", (req, res) =>
  adminVerificationController.reviewVerification(req, res)
);

export default router;

