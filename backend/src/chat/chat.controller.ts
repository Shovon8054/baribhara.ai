import { Request, Response } from "express";
import chatService from "./chat.service.js";

const chatController = {
    // =====================================
    // CHAT LIST
    // =====================================

    async getChatList(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const chats = await chatService.getChatList(
                userId
            );

            return res.status(200).json({
                success: true,
                data: chats,
            });
        } catch (error) {
            console.error(
                "Get chat list error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load chats",
            });
        }
    },

    // =====================================
    // GET MESSAGES
    // =====================================

    async getMessages(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user?.id;

            const otherUserId = req.params.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // Make sure route parameter is a string
            if (
                !otherUserId ||
                Array.isArray(otherUserId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const messages =
                await chatService.getMessages(
                    userId,
                    otherUserId
                );

            return res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (error) {
            console.error(
                "Get messages error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load messages",
            });
        }
    },

    // =====================================
    // SEND MESSAGE
    // =====================================

    async sendMessage(
        req: Request,
        res: Response
    ) {
        try {
            const senderId = (req as any).user?.id;

            const {
                receiver_id,
                content,
            } = req.body;

            if (!senderId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            if (!receiver_id) {
                return res.status(400).json({
                    success: false,
                    message: "Receiver ID is required",
                });
            }

            if (
                typeof content !== "string" ||
                !content.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Message cannot be empty",
                });
            }

            const message =
                await chatService.sendMessage(
                    senderId,
                    receiver_id,
                    content.trim()
                );

            return res.status(201).json({
                success: true,
                data: message,
            });
        } catch (error) {
            console.error(
                "Send message error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to send message",
            });
        }
    },

    // =====================================
    // MARK AS READ
    // =====================================

    async markAsRead(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user?.id;

            const senderId = req.params.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            if (
                !senderId ||
                Array.isArray(senderId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid sender ID",
                });
            }

            const messages =
                await chatService.markMessagesAsRead(
                    userId,
                    senderId
                );

            return res.status(200).json({
                success: true,
                data: messages,
            });
        } catch (error) {
            console.error(
                "Mark read error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to mark messages as read",
            });
        }
    },

    async getChatUser(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.params.userId;

            // Validate userId
            if (!userId || Array.isArray(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const user = await chatService.getChatUser(userId);

            return res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            console.error(
                "Get chat user error:",
                error
            );

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    },
};

export default chatController;