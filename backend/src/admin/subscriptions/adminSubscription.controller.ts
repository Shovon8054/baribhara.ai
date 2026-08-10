import { Request, Response } from "express";
import adminSubscriptionService from "./adminSubscription.service.js";

class AdminSubscriptionController {

    async getAllSubscriptions(
        req: Request,
        res: Response
    ) {
        try {
            const subscriptions =
                await adminSubscriptionService.getAllSubscriptions();

            return res.status(200).json({
                success: true,
                message: "Subscriptions fetched successfully",
                data: subscriptions
            });

        } catch (error) {

            console.error(
                "Get admin subscriptions error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch subscriptions"
            });
        }
    }
}

export default new AdminSubscriptionController();