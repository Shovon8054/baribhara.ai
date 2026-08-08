import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getChatList,
    ChatUser,
} from "../../services/chat.service";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8081/api";

const getImageUrl = (
    image: string | null
) => {

    if (!image) {
        return null;
    }

    if (image.startsWith("http")) {
        return image;
    }

    const backendUrl =
        API_URL.replace("/api", "");

    return `${backendUrl}${image}`;
};

const ChatList = () => {

    const navigate = useNavigate();

    const [chats, setChats] =
        useState<ChatUser[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const loadChats = async () => {

        try {

            const data =
                await getChatList();

            setChats(data || []);

        } catch (error) {

            console.error(
                "Failed to load chats:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    const filteredChats =
        chats.filter((chat) =>
            chat.full_name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm">Loading chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 py-6 sm:py-10">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    Messages
                                </h1>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Connect with property owners and tenants
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Chats Badge */}
                    {filteredChats.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            {filteredChats.length} {filteredChats.length === 1 ? 'conversation' : 'conversations'}
                        </span>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
        w-full
        pl-11 pr-4 py-3
        bg-slate-800/50
        border border-slate-700
        rounded-xl
        text-sm text-white
        placeholder:text-slate-500
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500/30
        focus:border-cyan-500
        transition-all
        duration-300
        hover:border-slate-600
        "
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {filteredChats.length === 0 && (
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/20">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-white mb-1">No conversations found</p>
                        <p className="text-sm text-slate-400">Start chatting with owners from property pages</p>
                        <button
                            onClick={() => navigate('/properties')}
                            className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                        >
                            Browse Properties
                        </button>
                    </div>
                )}

                {/* Chat List */}
                {filteredChats.length > 0 && (
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/5">
                        {filteredChats.map((chat, index) => {
                            const imageUrl = getImageUrl(chat.profile_image);
                            const isLast = index === filteredChats.length - 1;

                            return (
                                <button
                                    key={chat.user_id}
                                    onClick={() => navigate(`/chat/${chat.user_id}`)}
                                    className={`
                w-full flex items-center gap-4 p-4 sm:p-5 
                hover:bg-slate-700/30 
                transition-all duration-200 
                text-left group
                ${!isLast ? 'border-b border-slate-700/50' : ''}
              `}
                                >
                                    {/* Profile Avatar */}
                                    <div className="relative flex-shrink-0">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={chat.full_name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                                {chat.full_name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}

                                        {/* Online Status Dot
                                        {chat.online && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-800"></span>
                                        )} */}
                                    </div>

                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h2 className="font-semibold text-white text-base truncate group-hover:text-cyan-400 transition-colors duration-200">
                                                {chat.full_name}
                                            </h2>
                                            <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0 font-medium">
                                                {new Date(chat.last_message_time).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-slate-400 truncate pr-3 group-hover:text-slate-300 transition-colors duration-200">
                                                {chat.last_message}
                                            </p>

                                            {Number(chat.unread_count) > 0 && (
                                                <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
                                                    {chat.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow Icon */}
                                    <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;