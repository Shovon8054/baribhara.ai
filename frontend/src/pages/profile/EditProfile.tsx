import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getProfile } from "../../services/profile.service";

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
                    setPreview(
                        `http://localhost:8081${data.profile_image}`
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );
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
            alert("Please select an image file.");
            return;
        }

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB.");
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

            alert("Profile updated successfully.");

            navigate("/profile");
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update profile."
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
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="max-w-xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-bold text-gray-800 mb-5">
                Edit Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 rounded-lg p-5"
            >

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">

                    <div className="w-24 h-24 rounded-full overflow-hidden border">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-3xl text-gray-400">
                                    {name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            </div>
                        )}
                    </div>

                    <label
                        htmlFor="profileImage"
                        className="mt-3 text-sm text-blue-600 cursor-pointer hover:underline"
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

                    <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG or WEBP · Max 5MB
                    </p>
                </div>

                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-gray-500"
                    />
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                        Phone
                    </label>

                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                        placeholder="Enter your phone number"
                    />
                </div>

                {/* Role */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-1">
                        Role
                    </label>

                    <input
                        type="text"
                        value={user?.role || ""}
                        disabled
                        className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-gray-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="flex-1 border border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default EditProfile;