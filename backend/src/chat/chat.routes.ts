import { Router } from "express";
import chatController from "./chat.controller.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = Router();

router.get(
    "/",
    requireAuth,
    chatController.getChatList
);

router.get(
    "/user/:userId",
    requireAuth,
    chatController.getChatUser
);

router.get(
    "/:userId",
    requireAuth,
    chatController.getMessages
);

router.post(
    "/",
    requireAuth,
    chatController.sendMessage
);

router.patch(
    "/:userId/read",
    requireAuth,
    chatController.markAsRead
);

export default router;