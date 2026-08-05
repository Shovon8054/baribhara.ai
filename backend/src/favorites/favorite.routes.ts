import { Router } from "express";
import favoriteController from "./favorite.controller.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/:propertyId",
  requireAuth,
  favoriteController.addToFavorites
);

router.get(
  "/",
  requireAuth,
  favoriteController.getFavorites
);

router.delete(
  "/:propertyId",
  requireAuth,
  favoriteController.removeFavorite
);

export default router;