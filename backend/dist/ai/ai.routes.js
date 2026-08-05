import { Router } from "express";
import aiController from "./ai.controller.js";
const router = Router();
router.post("/search", aiController.search);
router.post("/listing", aiController.listingAssistant);
export default router;
