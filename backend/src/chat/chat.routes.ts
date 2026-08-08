import { Router } from "express";
import chatController from "./chat.controller.js";
import requireAuth from "../middleware/authMiddleware.js";
import requirePremium from "../middleware/premiumMiddleware.js";

const router = Router();

// 1. Authenticate first
router.use(requireAuth);

// 2. Then check Premium subscription
router.use(requirePremium);

router.get(
    "/",
    chatController.getChatList
);

router.get(
    "/user/:userId",
    chatController.getChatUser
);

router.get(
    "/:userId",
    chatController.getMessages
);

router.post(
    "/",
    chatController.sendMessage
);

router.patch(
    "/:userId/read",
    chatController.markAsRead
);

export default router;