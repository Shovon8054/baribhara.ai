import subscriptionService from "../subscription/subscription.service.js";
const requirePremium = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const isPremium = await subscriptionService
            .isPremium(userId);
        if (!isPremium) {
            return res.status(403).json({
                success: false,
                message: "Premium subscription required",
                code: "PREMIUM_REQUIRED",
            });
        }
        next();
    }
    catch (error) {
        console.error("Premium middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify subscription",
        });
    }
};
export default requirePremium;
