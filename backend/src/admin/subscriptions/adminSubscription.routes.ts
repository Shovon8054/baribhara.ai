import { Router } from "express";

import adminSubscriptionController
    from "./adminSubscription.controller.js";

import requireAuth
    from "../../middleware/authMiddleware.js";

import requireAdmin
    from "../../middleware/adminMiddleware.js";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get(
    "/",
    adminSubscriptionController.getAllSubscriptions
);

export default router;