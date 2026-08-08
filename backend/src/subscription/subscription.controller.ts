import { Request, Response } from "express";
import subscriptionService from "./subscription.service.js";

class SubscriptionController {

    // GET /api/subscription
    async getSubscription(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user.id;

            const subscription =
                await subscriptionService
                    .getSubscription(userId);

            return res.status(200).json({
                success: true,
                data: subscription,
            });

        } catch (error) {
            console.error(
                "Get subscription error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get subscription",
            });
        }
    }


    // POST /api/subscription/upgrade
    // DEVELOPMENT ONLY
    async upgrade(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user.id;

            // Premium for 30 days
            const expiresAt = new Date();

            expiresAt.setDate(
                expiresAt.getDate() + 30
            );

            const subscription =
                await subscriptionService
                    .upgradeToPremium(
                        userId,
                        expiresAt
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Premium activated successfully",
                data: subscription,
            });

        } catch (error) {
            console.error(
                "Upgrade error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to upgrade",
            });
        }
    }


    // PATCH /api/subscription/cancel
    async cancel(
        req: Request,
        res: Response
    ) {
        try {
            const userId = (req as any).user.id;

            const subscription =
                await subscriptionService
                    .cancelSubscription(userId);

            return res.status(200).json({
                success: true,
                message:
                    "Subscription cancelled",
                data: subscription,
            });

        } catch (error) {
            console.error(
                "Cancel subscription error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to cancel subscription",
            });
        }
    }
}

export default new SubscriptionController();