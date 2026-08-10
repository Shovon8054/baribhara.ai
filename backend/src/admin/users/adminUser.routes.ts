import { Router } from "express";
import adminUserController from "./adminUser.controller.js";
import requireAuth from "../../middleware/authMiddleware.js";
import requireAdmin from "../../middleware/adminMiddleware.js";

const router = Router();

// All admin user routes require authentication + admin role
router.use(requireAuth);
router.use(requireAdmin);


// Get all users
router.get(
    "/",
    adminUserController.getAllUsers
);


// Block user
router.patch(
    "/:id/block",
    adminUserController.blockUser
);


// Unblock user
router.patch(
    "/:id/unblock",
    adminUserController.unblockUser
);

export default router;