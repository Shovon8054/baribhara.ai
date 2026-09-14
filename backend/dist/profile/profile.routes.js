import { Router } from "express";
import profileController from "./profile.controller.js";
import requireAuth from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", requireAuth, profileController.getProfile);
router.get("/properties", requireAuth, profileController.getMyProperties);
export default router;
