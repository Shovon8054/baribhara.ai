import { Router } from "express";

import requireAuth
    from "../middleware/authMiddleware.js";

import subscriptionController
    from "./subscription.controller.js";

const router = Router();

router.get(
    "/",
    requireAuth,
    subscriptionController.getSubscription
);

router.post(
    "/upgrade",
    requireAuth,
    subscriptionController.upgrade
);

router.patch(
    "/cancel",
    requireAuth,
    subscriptionController.cancel
);

export default router;