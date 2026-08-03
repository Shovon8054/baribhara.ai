import { Router } from "express";
import authRoutes from "../auth/signup/auth.routes";
import signinRoutes from "../auth/signin/signin.routes";
import propertyRoutes from "../property-listing/property.routes";
import requireAuth from "../middleware/authMiddleware";




const router = Router();

router.use("/auth", authRoutes);
// POST http://localhost:8083/api/auth/register
router.use("/auth", signinRoutes);
// POST http://localhost:8081/api/auth/login

// Protect all non-auth routes
router.use(requireAuth);

router.use("/property", propertyRoutes);

console.log("✅ Main routes loaded");



export default router;