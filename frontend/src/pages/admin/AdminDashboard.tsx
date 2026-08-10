import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/signin");
            return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.role !== "ADMIN") {
            navigate("/home");
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        navigate("/signin");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">


            {/* Main */}

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Manage your BashaBhara.AI platform
                    </p>

                </div>


                {/* Statistics */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Users */}

                    <div className="bg-white rounded-xl p-6 shadow-sm border">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Total Users
                                </p>

                                <h3 className="text-3xl font-bold mt-2">
                                    0
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                                👥
                            </div>

                        </div>

                    </div>


                    {/* Properties */}

                    <div className="bg-white rounded-xl p-6 shadow-sm border">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Properties
                                </p>

                                <h3 className="text-3xl font-bold mt-2">
                                    0
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                                🏠
                            </div>

                        </div>

                    </div>


                    {/* Premium */}

                    <div className="bg-white rounded-xl p-6 shadow-sm border">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Premium Users
                                </p>

                                <h3 className="text-3xl font-bold mt-2">
                                    0
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
                                ⭐
                            </div>

                        </div>

                    </div>

                </div>


                {/* Admin Actions */}

                <div className="mt-10">

                    <h2 className="text-xl font-bold text-gray-800 mb-5">
                        Management
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                        {/* Users */}

                        <button
                            onClick={() =>
                                navigate("/admin/users")
                            }
                            className="bg-white border rounded-xl p-6 text-left hover:shadow-md hover:border-blue-400 transition"
                        >

                            <div className="text-3xl mb-4">
                                👥
                            </div>

                            <h3 className="text-lg font-bold">
                                Manage Users
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                View, activate, deactivate and manage users.
                            </p>

                        </button>


                        {/* Properties */}

                        <button
                            onClick={() =>
                                navigate("/admin/properties")
                            }
                            className="bg-white border rounded-xl p-6 text-left hover:shadow-md hover:border-green-400 transition"
                        >

                            <div className="text-3xl mb-4">
                                🏠
                            </div>

                            <h3 className="text-lg font-bold">
                                Manage Properties
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                View and manage all property listings.
                            </p>

                        </button>


                        {/* Subscriptions */}

                        <button
                            onClick={() =>
                                navigate("/admin/subscriptions")
                            }
                            className="bg-white border rounded-xl p-6 text-left hover:shadow-md hover:border-purple-400 transition"
                        >

                            <div className="text-3xl mb-4">
                                💳
                            </div>

                            <h3 className="text-lg font-bold">
                                Subscriptions
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Monitor Premium subscriptions and expiry.
                            </p>

                        </button>

                    </div>

                </div>


                {/* Recent Activity */}

                <div className="mt-10 bg-white border rounded-xl">

                    <div className="p-6 border-b">

                        <h2 className="text-xl font-bold">
                            Recent Activity
                        </h2>

                    </div>

                    <div className="p-6">

                        <p className="text-gray-500 text-center py-8">
                            No recent activity.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AdminDashboard;