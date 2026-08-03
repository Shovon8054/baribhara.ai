import { Router } from "express";
import authRoutes from "../auth/signup/auth.routes";
import signinRoutes from "../auth/signin/signin.routes";


const router = Router();

router.use("/auth", authRoutes);
// POST http://localhost:8083/api/auth/register
router.use("/auth", signinRoutes);



export default router;