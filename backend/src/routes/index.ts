import { Router } from "express";
import authRoutes from "../auth/signup/auth.routes";


const router = Router();

router.use("/auth", authRoutes);

// Later
// router.use("/properties", propertyRoutes);
// router.use("/bookings", bookingRoutes);

export default router;