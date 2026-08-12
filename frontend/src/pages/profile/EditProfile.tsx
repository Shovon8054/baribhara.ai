import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { getProfile } from "../../services/profile.service";
import { getImageUrl } from "../../utils/imageUrl";

interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
    profile_image?: string;
}

const EditProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [profileImage, setProfileImage] =
        useState<File | null>(null);

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================
    // FETCH PROFILE
    // =========================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();

                const data = response.data;

                setUser(data);

                setName(data.name || "");
                setPhone(data.phone || "");
                if (data.profile_image) {
                    setPreview(getImageUrl(data.profile_image));
                }
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Only allow images
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB.");
            return;
        }

        setProfileImage(file);

        // Preview
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("full_name", name);
            formData.append("phone", phone);

            if (profileImage) {
                formData.append(
                    "profile_image",
                    profileImage
                );
            }

            await api.patch(
                "/edit-profile",
                formData
            );

            toast.success("Profile updated successfully! 🎉", {
                duration: 4000,
            });

            navigate("/profile");
        } catch (error: any) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate("/profile")}
                        className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Edit Profile
                        </h1>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Update your personal information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300"
                >
                    {/* Profile Image */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-700/50 shadow-lg">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">
                                            {name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload Overlay */}
                            <label
                                htmlFor="profileImage"
                                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                        </div>

                        <label
                            htmlFor="profileImage"
                            className="mt-3 text-sm text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors duration-200 font-medium"
                        >
                            Change Profile Picture
                        </label>

                        <input
                            id="profileImage"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG or WEBP · Max 5MB
                        </p>
                    </div>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="
                                    w-full
                                    pl-9 pr-4 py-2.5
                                    bg-slate-900/50
                                    border border-slate-700
                                    rounded-lg
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-cyan-500/30
                                    focus:border-cyan-500
                                    transition-all
                                    duration-200
                                    hover:border-slate-600
                                "
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="
                                    w-full
                                    pl-9 pr-4 py-2.5
                                    bg-slate-900/30
                                    border border-slate-700
                                    rounded-lg
                                    text-sm text-slate-500
                                    cursor-not-allowed
                                "
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Phone
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="
                                    w-full
                                    pl-9 pr-4 py-2.5
                                    bg-slate-900/50
                                    border border-slate-700
                                    rounded-lg
                                    text-sm text-white
                                    placeholder:text-slate-500
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-cyan-500/30
                                    focus:border-cyan-500
                                    transition-all
                                    duration-200
                                    hover:border-slate-600
                                "
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Role
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={user?.role || ""}
                                disabled
                                className="
                                    w-full
                                    pl-9 pr-4 py-2.5
                                    bg-slate-900/30
                                    border border-slate-700
                                    rounded-lg
                                    text-sm text-slate-500
                                    cursor-not-allowed
                                "
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="
                                flex-1
                                px-4 py-2.5
                                bg-slate-800/50
                                border border-slate-700
                                text-slate-300
                                text-sm font-medium
                                rounded-lg
                                hover:bg-slate-700/50
                                hover:text-white
                                transition-all
                                duration-200
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                flex-1
                                px-4 py-2.5
                                bg-gradient-to-r from-cyan-500 to-indigo-500
                                text-white
                                text-sm font-medium
                                rounded-lg
                                hover:from-cyan-600 hover:to-indigo-600
                                shadow-lg shadow-cyan-500/25
                                hover:shadow-cyan-500/40
                                transition-all
                                duration-300
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:hover:shadow-lg
                            "
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;