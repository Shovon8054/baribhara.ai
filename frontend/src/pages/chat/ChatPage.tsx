import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { io, Socket } from "socket.io-client";

import {
    getMessages,
    sendMessage,
    markMessagesAsRead,
    Message,
} from "../../services/chat.service";

import api from "../../api/axios";


// =====================================
// TYPES
// =====================================

interface ChatUser {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    profile_image?: string | null;
    role?: string;
}


// =====================================
// SOCKET URL
// =====================================

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:8081");


// =====================================
// COMPONENT
// =====================================

const ChatPage = () => {

    const { userId } = useParams<{
        userId: string;
    }>();

    const navigate = useNavigate();


    // =====================================
    // STATE
    // =====================================

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [message, setMessage] =
        useState("");

    const [currentUserId, setCurrentUserId] =
        useState("");

    const [chatUser, setChatUser] =
        useState<ChatUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [userLoading, setUserLoading] =
        useState(true);

    const [typing, setTyping] =
        useState(false);

    const [online, setOnline] =
        useState(false);


    // =====================================
    // REFS
    // =====================================

    const socketRef =
        useRef<Socket | null>(null);

    const messagesEndRef =
        useRef<HTMLDivElement | null>(null);

    const typingTimeoutRef =
        useRef<ReturnType<
            typeof setTimeout
        > | null>(null);


    // =====================================
    // GET CURRENT USER
    // =====================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return;
        }

        try {

            const user =
                JSON.parse(storedUser);

            setCurrentUserId(
                user.id
            );

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );
        }

    }, []);


    // =====================================
    // GET CHAT USER
    // =====================================

    useEffect(() => {

        if (!userId) {
            return;
        }

        const loadChatUser =
            async () => {

                try {

                    setUserLoading(true);

                    /*
                     * Change this endpoint if your
                     * backend uses another endpoint
                     * for getting a user's profile.
                     */

                    const response =
                        await api.get(
                            `/chat/user/${userId}`
                        );

                    setChatUser(
                        response.data.data ||
                        response.data
                    );

                } catch (error) {

                    console.error(
                        "Failed to load chat user:",
                        error
                    );

                } finally {

                    setUserLoading(false);
                }
            };

        loadChatUser();

    }, [userId]);


    // =====================================
    // LOAD MESSAGES
    // =====================================

    useEffect(() => {

        if (!userId) {
            return;
        }

        const loadMessages =
            async () => {

                try {

                    setLoading(true);

                    const data =
                        await getMessages(
                            userId
                        );

                    setMessages(
                        data || []
                    );

                    await markMessagesAsRead(
                        userId
                    );

                } catch (error) {

                    console.error(
                        "Failed to load messages:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };

        loadMessages();

    }, [userId]);


    // =====================================
    // SOCKET.IO
    // =====================================

    useEffect(() => {

        if (
            !currentUserId ||
            !userId
        ) {
            return;
        }

        const socket =
            io(SOCKET_URL, {
                transports: [
                    "polling",
                    "websocket",
                ],
                withCredentials: true,
            });

        socketRef.current =
            socket;


        // =================================
        // CONNECT
        // =================================

        socket.on(
            "connect",
            () => {

                console.log(
                    "Socket connected:",
                    socket.id
                );

                socket.emit(
                    "user_online",
                    currentUserId
                );

                if (userId) {
                    socket.emit(
                        "check_user_online",
                        userId
                    );
                }

                socket.emit(
                    "join_chat",
                    {
                        userId:
                            currentUserId,
                        otherUserId:
                            userId,
                    }
                );
            }
        );


        // =================================
        // RECEIVE MESSAGE
        // =================================

        socket.on(
            "receive_message",
            (
                newMessage: Message
            ) => {

                const belongsToChat =
                    (
                        newMessage.sender_id ===
                        userId &&
                        newMessage.receiver_id ===
                        currentUserId
                    ) ||
                    (
                        newMessage.sender_id ===
                        currentUserId &&
                        newMessage.receiver_id ===
                        userId
                    );

                if (!belongsToChat) {
                    return;
                }


                setMessages(
                    (previous) => {

                        /*
                         * Prevent duplicate messages.
                         */

                        const alreadyExists =
                            previous.some(
                                (item) =>
                                    item.id ===
                                    newMessage.id
                            );

                        if (
                            alreadyExists
                        ) {
                            return previous;
                        }

                        return [
                            ...previous,
                            newMessage,
                        ];
                    }
                );


                // If the message came from
                // the other user, mark it read.

                if (
                    newMessage.sender_id ===
                    userId
                ) {

                    markMessagesAsRead(
                        userId
                    ).catch(
                        console.error
                    );
                }
            }
        );


        // =================================
        // TYPING
        // =================================

        socket.on(
            "user_typing",
            ({
                sender_id,
            }: {
                sender_id: string;
            }) => {

                if (
                    sender_id &&
                    userId &&
                    String(sender_id).toLowerCase() ===
                    String(userId).toLowerCase()
                ) {

                    setTyping(true);
                }
            }
        );


        // =================================
        // STOP TYPING
        // =================================

        socket.on(
            "user_stop_typing",
            ({
                sender_id,
            }: {
                sender_id: string;
            }) => {

                if (
                    sender_id &&
                    userId &&
                    String(sender_id).toLowerCase() ===
                    String(userId).toLowerCase()
                ) {

                    setTyping(false);
                }
            }
        );


        // =================================
        // USER STATUS
        // =================================

        socket.on(
            "user_status",
            ({
                userId: statusUserId,
                online,
            }: {
                userId: string;
                online: boolean;
            }) => {

                if (
                    statusUserId ===
                    userId
                ) {

                    setOnline(
                        online
                    );
                }
            }
        );


        // =================================
        // DISCONNECT
        // =================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Socket disconnected"
                );
            }
        );


        // =================================
        // CLEANUP
        // =================================

        return () => {

            socket.disconnect();

            socketRef.current =
                null;
        };

    }, [
        currentUserId,
        userId,
    ]);


    // =====================================
    // AUTO SCROLL
    // =====================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);


    // =====================================
    // SEND MESSAGE
    // =====================================

    const handleSendMessage =
        async () => {

            if (
                !message.trim() ||
                !userId ||
                !currentUserId
            ) {
                return;
            }

            try {

                const content =
                    message.trim();

                /*
                 * Save message in database.
                 */

                const newMessage =
                    await sendMessage(
                        userId,
                        content
                    );


                /*
                 * Add immediately to
                 * sender's screen.
                 */

                setMessages(
                    (previous) => {

                        const exists =
                            previous.some(
                                (item) =>
                                    item.id ===
                                    newMessage.id
                            );

                        if (exists) {
                            return previous;
                        }

                        return [
                            ...previous,
                            newMessage,
                        ];
                    }
                );


                /*
                 * Send through Socket.IO
                 * so the other user receives
                 * it immediately.
                 */

                socketRef.current?.emit(
                    "send_message",
                    newMessage
                );


                /*
                 * Clear input.
                 */

                setMessage("");


                /*
                 * Stop typing.
                 */

                socketRef.current?.emit(
                    "stop_typing",
                    {
                        sender_id:
                            currentUserId,
                        receiver_id:
                            userId,
                    }
                );

            } catch (error) {

                console.error(
                    "Failed to send message:",
                    error
                );
            }
        };


    // =====================================
    // TYPING
    // =====================================

    const handleTyping = (
        value: string
    ) => {

        setMessage(value);

        if (
            !userId ||
            !currentUserId
        ) {
            return;
        }


        // Clear previous timeout

        if (
            typingTimeoutRef.current
        ) {

            clearTimeout(
                typingTimeoutRef.current
            );
        }


        if (
            value.trim()
        ) {

            socketRef.current?.emit(
                "typing",
                {
                    sender_id:
                        currentUserId,
                    receiver_id:
                        userId,
                }
            );


            /*
             * Automatically stop typing
             * after 3 seconds.
             */

            typingTimeoutRef.current =
                setTimeout(() => {

                    socketRef.current?.emit(
                        "stop_typing",
                        {
                            sender_id:
                                currentUserId,
                            receiver_id:
                                userId,
                        }
                    );

                }, 3000);

        } else {

            socketRef.current?.emit(
                "stop_typing",
                {
                    sender_id:
                        currentUserId,
                    receiver_id:
                        userId,
                }
            );
        }
    };


    // =====================================
    // ENTER TO SEND
    // =====================================

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleSendMessage();
        }
    };


    // =====================================
    // PROFILE IMAGE
    // =====================================

    const getProfileImage = () => {

        if (
            !chatUser?.profile_image
        ) {
            return null;
        }

        if (
            chatUser.profile_image
                .startsWith("http")
        ) {

            return chatUser.profile_image;
        }

        const apiUrl =
            import.meta.env
                .VITE_API_URL ||
            "http://localhost:8081/api";

        const backendUrl =
            apiUrl.replace(
                "/api",
                ""
            );

        return `${backendUrl}${chatUser.profile_image}`;
    };


    const profileImage =
        getProfileImage();


    // =====================================
    // FORMAT TIME
    // =====================================

    const formatTime = (
        date: string
    ) => {

        return new Date(
            date
        ).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // =====================================
    // UI
    // =====================================

    return (

        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-3 sm:px-6 py-4 flex items-center justify-center">
            <div className="w-full max-w-4xl h-[calc(100vh-100px)] min-h-[500px] flex flex-col bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">

                {/* =================================
        HEADER - Professional
    ================================= */}
                <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate("/chat")}
                            className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 text-slate-400 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>

                        {/* Profile Avatar */}
                        {userLoading ? (
                            <div className="w-10 h-10 rounded-full bg-slate-700/50 animate-pulse" />
                        ) : profileImage ? (
                            <img
                                src={profileImage}
                                alt={chatUser?.full_name || "User"}
                                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-cyan-500/20">
                                {chatUser?.full_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}

                        {/* Name + Status */}
                        <div className="flex-1 min-w-0">
                            <h1 className="font-semibold text-base sm:text-lg text-white truncate">
                                {chatUser?.full_name || "User"}
                            </h1>
                            {typing ? (
                                <p className="text-xs text-cyan-400 font-medium flex items-center gap-1.5">
                                    <span className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                    typing...
                                </p>
                            ) : online ? (
                                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Online
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                    Offline
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =================================
        MESSAGES LIST - Professional
    ================================= */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-950/20">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-400 font-medium">Loading messages...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 && !typing ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-3 border border-slate-700/50">
                                    <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 font-medium text-sm">No messages yet</p>
                                <p className="text-xs text-slate-500 mt-1">Start the conversation</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg) => {
                                const isMine = msg.sender_id === currentUserId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fadeIn`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine
                                                    ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-tr-none shadow-lg shadow-cyan-500/20"
                                                    : "bg-slate-700/60 text-slate-200 rounded-tl-none border border-slate-600/30"
                                                }`}
                                        >
                                            <p className="break-words text-sm leading-relaxed">
                                                {msg.content}
                                            </p>
                                            <div
                                                className={`flex items-center justify-end gap-1.5 text-[10px] mt-1.5 ${isMine ? "text-cyan-100/70" : "text-slate-400"
                                                    }`}
                                            >
                                                <span>{formatTime(msg.created_at)}</span>
                                                {isMine && (
                                                    <span className="font-medium">{msg.is_read ? "✓✓" : "✓"}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator */}
                            {typing && (
                                <div className="flex justify-start animate-fadeIn">
                                    <div className="bg-slate-700/60 border border-slate-600/30 rounded-2xl rounded-tl-none px-4 py-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-400 font-medium">typing</span>
                                            <span className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* =================================
        MESSAGE INPUT BAR - Professional
    ================================= */}
                <div className="bg-slate-800/60 backdrop-blur-sm border-t border-slate-700/50 flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="
            flex-1
            bg-slate-900/60
            border border-slate-700
            rounded-full
            px-5 py-2.5
            text-sm text-white
            placeholder:text-slate-500
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500/30
            focus:border-cyan-500
            transition-all
            duration-200
          "
                        />

                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="
            px-6 py-2.5
            bg-gradient-to-r from-cyan-500 to-indigo-500
            text-white
            text-sm
            font-medium
            rounded-full
            hover:from-cyan-600 hover:to-indigo-600
            shadow-lg shadow-cyan-500/25
            hover:shadow-cyan-500/40
            transition-all
            duration-300
            disabled:opacity-40
            disabled:cursor-not-allowed
            disabled:hover:shadow-lg
            disabled:hover:from-cyan-500
            disabled:hover:to-indigo-500
          "
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* CSS Animations */}
                <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px);
        }
      }
      .animate-bounce {
        animation: bounce 1s infinite;
      }
    `}</style>
            </div>
        </div>
    );
};

export default ChatPage;