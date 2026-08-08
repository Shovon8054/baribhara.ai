import {
    Request,
    Response,
    NextFunction,
} from "express";

import subscriptionService
    from "../subscription/subscription.service.js";

const requirePremium = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;
        const isPremium =
            await subscriptionService
                .isPremium(userId);

        if (!isPremium) {
            return res.status(403).json({
                success: false,
                message:
                    "Premium subscription required",
                code: "PREMIUM_REQUIRED",
            });
        }

        next();

    } catch (error) {
        console.error(
            "Premium middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to verify subscription",
        });
    }
};

export default requirePremium;