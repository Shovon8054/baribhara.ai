import adminVerificationService from "./adminVerification.service.js";
export class AdminVerificationController {
    /**
     * GET /api/admin/verifications
     * List verification submissions with optional status filter (e.g. ?status=MANUAL_REVIEW).
     */
    async getVerifications(req, res) {
        try {
            const status = req.query.status;
            const verifications = await adminVerificationService.getVerifications({
                status,
            });
            return res.status(200).json({
                success: true,
                count: verifications.length,
                data: verifications,
            });
        }
        catch (err) {
            console.error("Error in getVerifications:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Failed to retrieve verifications",
            });
        }
    }
    /**
     * GET /api/admin/verifications/:id
     * Get single verification submission details for manual review.
     */
    async getVerificationById(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Verification ID is required",
                });
            }
            const verification = await adminVerificationService.getVerificationById(id);
            if (!verification) {
                return res.status(404).json({
                    success: false,
                    message: "Verification submission not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: verification,
            });
        }
        catch (err) {
            console.error("Error in getVerificationById:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Failed to retrieve verification details",
            });
        }
    }
    /**
     * PATCH /api/admin/verifications/:id
     * Approve or reject a verification submission.
     * Body: { action: "APPROVE" | "REJECT", reason?: string, review_notes?: string }
     */
    async reviewVerification(req, res) {
        try {
            const id = req.params.id;
            const adminId = req.user?.id;
            if (!adminId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Verification ID is required",
                });
            }
            const { action, status, reason, review_notes } = req.body;
            // Validate review input
            const normalizedAction = (action || status || "").toUpperCase();
            if (!["APPROVE", "REJECT", "VERIFIED", "REJECTED"].includes(normalizedAction)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid action. Must be 'APPROVE' or 'REJECT'.",
                });
            }
            const result = await adminVerificationService.reviewVerification(id, adminId, {
                action: normalizedAction === "VERIFIED" ? "APPROVE" : normalizedAction === "REJECTED" ? "REJECT" : normalizedAction,
                reason,
                review_notes,
            });
            return res.status(200).json({
                success: true,
                message: `Verification ${result.decision === "VERIFIED" ? "approved" : "rejected"} successfully.`,
                data: result,
            });
        }
        catch (err) {
            console.error("Error in reviewVerification:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "Failed to submit review decision",
            });
        }
    }
}
export const adminVerificationController = new AdminVerificationController();
export default adminVerificationController;
