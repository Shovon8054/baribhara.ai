import { Request, Response } from "express";
import adminUserService from "./adminUser.service.js";

class AdminUserController {

    // GET /api/admin/users
    async getAllUsers(req: Request, res: Response) {

        try {

            const users = await adminUserService.getAllUsers();

            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });

        } catch (error) {

            console.error("Get users error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch users"
            });
        }
    }


    // PATCH /api/admin/users/:id/block
    async blockUser(req: Request, res: Response) {

        try {

            const { id } = req.params as { id: string };

            const user = await adminUserService.blockUser(id);

            return res.status(200).json({
                success: true,
                message: "User blocked successfully",
                data: user
            });

        } catch (error: any) {

            console.error("Block user error:", error);

            return res.status(400).json({
                success: false,
                message: error.message || "Failed to block user"
            });
        }
    }


    // PATCH /api/admin/users/:id/unblock
    async unblockUser(req: Request, res: Response) {

        try {

            const { id } = req.params as { id: string };

            const user = await adminUserService.unblockUser(id);

            return res.status(200).json({
                success: true,
                message: "User unblocked successfully",
                data: user
            });

        } catch (error: any) {

            console.error("Unblock user error:", error);

            return res.status(400).json({
                success: false,
                message: error.message || "Failed to unblock user"
            });
        }
    }
}

export default new AdminUserController();