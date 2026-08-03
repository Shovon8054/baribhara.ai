import { Router } from "express";
import profileController from "./profile.controller";
import requireAuth from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  requireAuth,
  profileController.getProfile
);

router.get(
  "/properties",
  requireAuth,
  profileController.getMyProperties
);

export default router;