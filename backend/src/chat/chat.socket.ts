import { Server, Socket } from "socket.io";

// Track online users using Map<userId, Set<socketId>>
const userSocketsMap = new Map<string, Set<string>>();

export const initializeChatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("Socket connected:", socket.id);

        // =========================
        // USER ONLINE
        // =========================
        socket.on("user_online", (userId: string) => {
            if (!userId) return;

            socket.data.userId = userId;
            socket.join(`user:${userId}`);

            let userSockets = userSocketsMap.get(userId);
            const isFirstSocket = !userSockets || userSockets.size === 0;

            if (!userSockets) {
                userSockets = new Set<string>();
                userSocketsMap.set(userId, userSockets);
            }
            userSockets.add(socket.id);

            // Notify all clients if this user just came online
            if (isFirstSocket) {
                io.emit("user_status", {
                    userId,
                    online: true,
                });
            }

            console.log(`User ${userId} is online. Active sockets: ${userSockets.size}`);
        });

        // =========================
        // CHECK USER ONLINE STATUS
        // =========================
        socket.on("check_user_online", (targetUserId: string) => {
            if (!targetUserId) return;
            const userSockets = userSocketsMap.get(targetUserId);
            const isOnline = Boolean(userSockets && userSockets.size > 0);

            socket.emit("user_status", {
                userId: targetUserId,
                online: isOnline,
            });
        });

        // =========================
        // JOIN CHAT
        // =========================
        socket.on("join_chat", ({ userId, otherUserId }) => {
            if (userId && otherUserId) {
                socket.join(`chat:${userId}:${otherUserId}`);
                socket.join(`chat:${otherUserId}:${userId}`);
            }
        });

        // =========================
        // SEND MESSAGE
        // =========================
        socket.on("send_message", (message) => {
            const { receiver_id } = message;
            if (receiver_id) {
                io.to(`user:${receiver_id}`).emit("receive_message", message);
            }
        });

        // =========================
        // TYPING
        // =========================
        socket.on("typing", ({ receiver_id, sender_id }) => {
            if (receiver_id) {
                io.to(`user:${receiver_id}`).emit("user_typing", { sender_id });
            }
        });

        // =========================
        // STOP TYPING
        // =========================
        socket.on("stop_typing", ({ receiver_id, sender_id }) => {
            if (receiver_id) {
                io.to(`user:${receiver_id}`).emit("user_stop_typing", { sender_id });
            }
        });

        // =========================
        // DISCONNECT
        // =========================
        socket.on("disconnect", () => {
            const userId = socket.data.userId as string | undefined;

            if (userId) {
                const userSockets = userSocketsMap.get(userId);
                if (userSockets) {
                    userSockets.delete(socket.id);

                    // Only mark offline when the user's LAST socket disconnects
                    if (userSockets.size === 0) {
                        userSocketsMap.delete(userId);
                        io.emit("user_status", {
                            userId,
                            online: false,
                        });
                        console.log(`User ${userId} is offline (last socket disconnected)`);
                    }
                }
            }

            console.log("Socket disconnected:", socket.id);
        });
    });
};