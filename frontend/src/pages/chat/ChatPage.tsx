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
import { BACKEND_URL } from "../../utils/imageUrl";
import VerificationBadge from "../../components/VerificationBadge";


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
    is_verified?: boolean;
}


// =====================================
// SOCKET URL
// =====================================

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    BACKEND_URL ||
    window.location.origin;


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

    const messagesContainerRef =
        useRef<HTMLDivElement | null>(null);

    const inputRef =
        useRef<HTMLInputElement | null>(null);

    const isNearBottomRef =
        useRef(true);

    const [showScrollBottom, setShowScrollBottom] =
        useState(false);

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
    // AUTO SCROLL & CONTAINER SCROLL
    // =====================================

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior,
            });
        }
    };

    const handleContainerScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const nearBottom = distanceFromBottom < 100;
        isNearBottomRef.current = nearBottom;
        setShowScrollBottom(!nearBottom);
    };

    // Auto-scroll on initial load
    useEffect(() => {
        if (!loading && messages.length > 0) {
            scrollToBottom("auto");
        }
    }, [loading]);

    // Auto-scroll on new messages or typing state change (if user is near bottom)
    useEffect(() => {
        if (isNearBottomRef.current) {
            scrollToBottom("smooth");
        }
    }, [messages, typing]);


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

                // Always scroll to bottom after user sends a message
                isNearBottomRef.current = true;
                setTimeout(() => scrollToBottom("smooth"), 40);


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

        if (!chatUser?.profile_image) {
            return null;
        }

        if (chatUser.profile_image.startsWith("http")) {
            return chatUser.profile_image;
        }

        return `${BACKEND_URL}${chatUser.profile_image}`;
    };


    const profileImage =
        getProfileImage();


    // =====================================
    // FORMAT TIME & DATE
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

    const formatDateHeader = (dateStr: string) => {
        const messageDate = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        }
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        return messageDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
    };

    const quickReplies = [
        "Hi! Is this property still available?",
        "I'd love to schedule a visit to view it.",
        "Could you please share details on rent & deposit?",
    ];

    const handleQuickReply = (text: string) => {
        setMessage(text);
        inputRef.current?.focus();
    };


    // =====================================
    // UI
    // =====================================

    return (
        <div className="h-[calc(100dvh-64px)] sm:h-[calc(100dvh-80px)] max-h-[calc(100dvh-64px)] sm:max-h-[calc(100dvh-80px)] w-full overflow-hidden bg-gradient-to-b from-[#030712] via-[#070e1e] to-[#030712] flex flex-col p-2 sm:p-4 md:p-5">
            <div className="w-full max-w-4xl mx-auto h-full flex flex-col bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/60 shadow-2xl shadow-cyan-950/20 overflow-hidden relative">

                {/* =================================
                    HEADER - Fixed / No Scroll
                ================================= */}
                <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/60 flex-shrink-0 px-4 sm:px-6 py-3 sm:py-3.5 z-10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate("/chat")}
                                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 border border-transparent hover:border-slate-700"
                                title="Back to conversations"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>

                            {/* Profile Avatar with Status Ring */}
                            <div className="relative flex-shrink-0">
                                {userLoading ? (
                                    <div className="w-10 h-10 rounded-full bg-slate-700/50 animate-pulse" />
                                ) : profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={chatUser?.full_name || "User"}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/40"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-cyan-500/20">
                                        {chatUser?.full_name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}

                                {/* Online status dot */}
                                {!userLoading && (
                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${online ? "bg-emerald-400 ring-2 ring-emerald-500/30" : "bg-slate-600"
                                            }`}
                                        title={online ? "Online" : "Offline"}
                                    />
                                )}
                            </div>

                            {/* Name + Verification + Status */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h1 className="font-semibold text-base sm:text-lg text-white truncate">
                                        {chatUser?.full_name || "User"}
                                    </h1>
                                    {chatUser?.is_verified && (
                                        <VerificationBadge status="VERIFIED" size="xs" showLabel />
                                    )}
                                    {chatUser?.role && (
                                        <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                                            {chatUser.role}
                                        </span>
                                    )}
                                </div>
                                {typing ? (
                                    <p className="text-xs text-cyan-400 font-medium flex items-center gap-1.5 animate-pulse">
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
                                        Active now
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                        Offline
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Contact Actions if available */}
                        <div className="flex items-center gap-2">
                            {chatUser?.phone && (
                                <a
                                    href={`tel:${chatUser.phone}`}
                                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700/60"
                                    title={`Call ${chatUser.phone}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </a>
                            )}
                            {chatUser?.email && (
                                <a
                                    href={`mailto:${chatUser.email}`}
                                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700/60"
                                    title={`Email ${chatUser.email}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* =================================
                    MESSAGES LIST - Strictly Scrollable Inside
                ================================= */}
                <div
                    ref={messagesContainerRef}
                    onScroll={handleContainerScroll}
                    className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 bg-[#040814]/40 custom-chat-scrollbar relative"
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-9 h-9 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-400 font-medium">Loading conversation...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 && !typing ? (
                        <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center px-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/10">
                                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-white mb-1">
                                Say hello to {chatUser?.full_name || "this user"}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 mb-6">
                                Discuss property availability, rental terms, or arrange a viewing.
                            </p>

                            <div className="w-full flex flex-col gap-2">
                                <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider text-left mb-1">
                                    Quick messages:
                                </p>
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickReply(reply)}
                                        className="text-left text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/40 transition-all duration-200"
                                    >
                                        "{reply}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 pb-2">
                            {messages.map((msg, index) => {
                                const isMine = msg.sender_id === currentUserId;
                                const prevMsg = index > 0 ? messages[index - 1] : null;
                                const showDateHeader =
                                    !prevMsg ||
                                    new Date(msg.created_at).toDateString() !==
                                    new Date(prevMsg.created_at).toDateString();

                                return (
                                    <div key={msg.id || index}>
                                        {showDateHeader && (
                                            <div className="flex justify-center my-3">
                                                <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-400 shadow-sm backdrop-blur-sm">
                                                    {formatDateHeader(msg.created_at)}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fadeIn`}
                                        >
                                            {!isMine && (
                                                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mr-2 self-end mb-1">
                                                    {profileImage ? (
                                                        <img
                                                            src={profileImage}
                                                            alt=""
                                                            className="w-full h-full object-cover border border-cyan-500/30"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700">
                                                            {chatUser?.full_name?.charAt(0).toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl ${isMine
                                                        ? "bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white rounded-br-xs shadow-lg shadow-cyan-950/30 border border-cyan-400/20"
                                                        : "bg-slate-800/90 text-slate-100 rounded-bl-xs border border-slate-700/70 shadow-md"
                                                    }`}
                                            >
                                                <p className="break-words text-sm sm:text-[14.5px] leading-relaxed select-text">
                                                    {msg.content}
                                                </p>
                                                <div
                                                    className={`flex items-center justify-end gap-1.5 text-[10px] mt-1 ${isMine ? "text-cyan-100/80" : "text-slate-400"
                                                        }`}
                                                >
                                                    <span>{formatTime(msg.created_at)}</span>
                                                    {isMine && (
                                                        <span className="font-semibold text-cyan-200">
                                                            {msg.is_read ? "✓✓" : "✓"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator inside stream */}
                            {typing && (
                                <div className="flex justify-start animate-fadeIn items-end">
                                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mr-2 mb-1">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt=""
                                                className="w-full h-full object-cover border border-cyan-500/30"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700">
                                                {chatUser?.full_name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-bl-xs px-4 py-3 shadow-md">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Floating Scroll to Bottom Button */}
                {showScrollBottom && (
                    <button
                        onClick={() => scrollToBottom("smooth")}
                        className="absolute bottom-20 right-6 p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-slate-700 shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 z-20 group"
                        title="Scroll to latest messages"
                    >
                        <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                )}

                {/* =================================
                    MESSAGE INPUT BAR - Fixed at Bottom
                ================================= */}
                <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-700/60 flex-shrink-0 px-4 sm:px-6 py-3 sm:py-3.5 z-10">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-center gap-2 sm:gap-3"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="
                                flex-1
                                bg-slate-950/70
                                border border-slate-700/80
                                rounded-xl sm:rounded-2xl
                                px-4 sm:px-5 py-2.5 sm:py-3
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
                            type="submit"
                            disabled={!message.trim()}
                            className="
                                px-5 sm:px-6 py-2.5 sm:py-3
                                bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600
                                hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500
                                text-white
                                text-sm
                                font-semibold
                                rounded-xl sm:rounded-2xl
                                shadow-lg shadow-cyan-500/25
                                hover:shadow-cyan-500/40
                                transition-all
                                duration-200
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                disabled:hover:shadow-lg
                                flex items-center gap-2
                            "
                        >
                            <span>Send</span>
                            <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* CSS Custom Scrollbar & Animations */}
                <style>{`
                    .custom-chat-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(148, 163, 184, 0.25) transparent;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.25);
                        border-radius: 9999px;
                    }
                    .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(6, 182, 212, 0.5);
                    }
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