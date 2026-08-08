import { Request, Response } from "express";
import editProfileService from "./editProfile.service.js";

const editProfileController = {
    async updateProfile(req: Request, res: Response) {
        try {
            // =========================
            // Get Logged-in User
            // =========================

            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // =========================
            // Get Form Data
            // =========================

            const { full_name, phone } = req.body;

            if (!full_name || !full_name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Full name is required",
                });
            }

            // =========================
            // Get Uploaded Image
            // =========================

            const file = req.file;

            console.log("Uploaded file:", file);

            let profile_image: string | undefined;

            if (file) {
                profile_image =
                    `/uploads/profiles/${file.filename}`;
            }

            console.log(
                "Profile image:",
                profile_image
            );

            // =========================
            // Update Database
            // =========================

            const updatedUser =
                await editProfileService.updateProfile({
                    userId,
                    full_name: full_name.trim(),
                    phone: phone?.trim(),
                    profile_image,
                });

            // =========================
            // Response
            // =========================

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedUser,
            });

        } catch (error: any) {
            console.error(
                "Update profile error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update profile",
            });
        }
    },
};

export default editProfileController;