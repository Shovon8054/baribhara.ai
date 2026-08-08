import { Router } from "express";
import authRoutes from "../auth/signup/auth.routes.js";
import signinRoutes from "../auth/signin/signin.routes.js";
import propertyRoutes from "../property-listing/property.routes.js";
import requireAuth from "../middleware/authMiddleware.js";
import propertyController from "../property-listing/property.controller.js";
import profileRoutes from "../profile/profile.routes.js";
import editProfileRoutes from "../profile/editProfile/editProfile.routes.js";

import detailsRoutes from "../property-details/details.routes.js";

import aiRoutes from "../ai/ai.routes.js";
import favoriteRoutes from "../favorites/favorite.routes.js";
import comparisonRoutes from "../ai-comparison/comparison.routes.js";

import chatRoutes from "../chat/chat.routes.js";



const router = Router();

router.use("/auth", authRoutes);
// POST http://localhost:8083/api/auth/register
router.use("/auth", signinRoutes);
// POST http://localhost:8081/api/auth/login

// AI-assisted browsing is available from the public Home page.
router.use("/ai", aiRoutes);

// Protect all non-auth routes
router.use(requireAuth);

router.use("/property", propertyRoutes);
router.get("/", propertyController.getAllProperties);
router.use("/profile", profileRoutes);
router.use("/edit-profile", editProfileRoutes);


router.use("/property-details", detailsRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/ai", comparisonRoutes);

router.use("/chat", chatRoutes);

// console.log("Main routes loaded");



export default router;
