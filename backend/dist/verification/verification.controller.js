import { ZodError } from "zod";
import verificationService from "./verification.service.js";
import { submitVerificationSchema, reviewVerificationSchema, } from "./verification.validation.js";
export class VerificationController {
    /**
     * Get current verification status and history for the logged-in user.
     */
    async getStatus(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const result = await verificationService.getVerificationStatus(userId);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (err) {
            console.error("Error fetching verification status:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch verification status",
            });
        }
    }
    /**
     * Submit documents and information for verification.
     */
    async submit(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            // Validate request body
            const validatedData = submitVerificationSchema.parse(req.body);
            const result = await verificationService.submitVerification(userId, validatedData, req.file);
            return res.status(201).json({
                success: true,
                message: "Verification submitted successfully and is pending review.",
                data: result,
            });
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: err.errors.map((e) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })),
                });
            }
            console.error("Error submitting verification:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Failed to submit verification",
            });
        }
    }
    /**
     * Get verification history for the authenticated user.
     */
    async getHistory(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const history = await verificationService.getVerificationHistory(userId);
            return res.status(200).json({
                success: true,
                data: history,
            });
        }
        catch (err) {
            console.error("Error fetching verification history:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch verification history",
            });
        }
    }
    /**
     * Admin: List all verification records.
     */
    async getAll(req, res) {
        try {
            const status = req.query.status;
            const records = await verificationService.getAllVerifications({ status });
            return res.status(200).json({
                success: true,
                count: records.length,
                data: records,
            });
        }
        catch (err) {
            console.error("Error listing verifications:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch verifications",
            });
        }
    }
    /**
     * Admin: Review and update a verification status.
     */
    async review(req, res) {
        try {
            const adminId = req.user?.id;
            const id = req.params.id;
            if (!adminId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            if (!id) {
                return res.status(400).json({ success: false, message: "Verification ID is required" });
            }
            const validatedData = reviewVerificationSchema.parse(req.body);
            const updated = await verificationService.reviewVerification(id, adminId, validatedData);
            return res.status(200).json({
                success: true,
                message: `Verification marked as ${validatedData.status}`,
                data: updated,
            });
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: err.errors.map((e) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })),
                });
            }
            console.error("Error reviewing verification:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Failed to review verification",
            });
        }
    }
}
export const verificationController = new VerificationController();
export default verificationController;
