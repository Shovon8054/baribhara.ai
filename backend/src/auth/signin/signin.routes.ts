import { Router } from "express";
import { login, logout } from "./signin.controller";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

export default router;