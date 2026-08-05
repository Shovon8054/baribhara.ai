import { Router } from "express";
import detailsController from "./details.controller.js";

const router = Router();

router.get(
  "/:id",
  detailsController.getPropertyDetails
);

export default router;