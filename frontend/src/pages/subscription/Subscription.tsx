import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
    const navigate = useNavigate();

    const [billing, setBilling] = useState<"monthly" | "yearly">(
        "monthly"
    );

    const plans = [
        {
            name: "Free",
            monthly: 0,
            yearly: 0,
            description: "For users getting started",
            features: [
                "5 property searches",
                "3 favorite properties",
                "Basic property filters",
                "AI search",
            ],
        },
        {
            name: "Pro",
            monthly: 299,
            yearly: 2990,
            description: "For active property seekers",
            popular: true,
            features: [
                "Unlimited property searches",
                "50 favorite properties",
                "Advanced filters",
                "AI property search",
                "AI listing assistant",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            {/* Header */}
            <div className="text-center mb-10">

                <h1 className="text-3xl font-bold text-gray-800">
                    Choose Your Plan
                </h1>

                <p className="text-gray-500 mt-2">
                    Choose a plan that works best for you.
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex mt-6 bg-white border border-gray-200 rounded-lg p-1">

                    <button
                        onClick={() => setBilling("monthly")}
                        className={`px-5 py-2 rounded-md text-sm font-medium ${billing === "monthly"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Monthly
                    </button>

                    <button
                        onClick={() => setBilling("yearly")}
                        className={`px-5 py-2 rounded-md text-sm font-medium ${billing === "yearly"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Yearly
                    </button>

                </div>
            </div>

            {/* Plans */}
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">

                {plans.map((plan) => {
                    const price =
                        billing === "monthly"
                            ? plan.monthly
                            : plan.yearly;

                    return (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-xl border p-6 ${plan.popular
                                    ? "border-blue-500 shadow-md"
                                    : "border-gray-200"
                                }`}
                        >

                            {/* Popular Badge */}
                            {plan.popular && (
                                <span className="absolute top-4 right-4 text-xs font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                    Popular
                                </span>
                            )}

                            {/* Plan Name */}
                            <h2 className="text-xl font-bold text-gray-800">
                                {plan.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mt-6 mb-6">

                                <span className="text-3xl font-bold text-gray-800">
                                    ৳{price}
                                </span>

                                {price > 0 && (
                                    <span className="text-sm text-gray-500">
                                        /{billing === "monthly"
                                            ? "month"
                                            : "year"}
                                    </span>
                                )}

                            </div>

                            {/* Button */}
                            <button
                                onClick={() => {
                                    if (plan.name === "Pro") {
                                        navigate("/payment");
                                    }
                                }}
                                disabled={plan.name === "Free"}
                                className={`w-full py-2.5 rounded-lg font-medium ${plan.name === "Free"
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {plan.name === "Free"
                                    ? "Current Plan"
                                    : "Subscribe"}
                            </button>

                            {/* Features */}
                            <div className="border-t mt-6 pt-5">

                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    What's included:
                                </p>

                                <ul className="space-y-3">

                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-2 text-sm text-gray-600"
                                        >
                                            <span className="text-green-600">
                                                ✓
                                            </span>

                                            <span>{feature}</span>
                                        </li>
                                    ))}

                                </ul>

                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default Subscription;