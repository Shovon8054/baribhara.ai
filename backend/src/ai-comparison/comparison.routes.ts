import { Router } from "express";
import comparisonController from "./comparison.controller.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/property-comparison",
  requireAuth,
  comparisonController.compare
);

export default router;