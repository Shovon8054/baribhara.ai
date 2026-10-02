import https from "https";
import http from "http";
import adminVerificationService from "./adminVerification.service.js";
import pool from "../../db/dbConnection.js";
import cloudinary from "../../config/cloudinary.js";
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
    /**
     * GET /api/admin/verifications/:id/document
     * Proxies the authenticated Cloudinary PDF to the admin browser so the PDF
     * can be displayed inline in an <iframe> without exposing Cloudinary credentials.
     */
    async streamDocument(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ success: false, message: "Verification ID is required" });
            }
            // Look up the document_public_id for this verification record
            const dbRes = await pool.query(`SELECT document_public_id FROM user_verifications WHERE id = $1`, [id]);
            if (dbRes.rows.length === 0 || !dbRes.rows[0].document_public_id) {
                return res.status(404).json({ success: false, message: "No document found for this verification" });
            }
            const publicId = dbRes.rows[0].document_public_id;
            // Generate a short-lived signed URL (60 seconds — enough to proxy, never exposed to client)
            const expiresAt = Math.floor(Date.now() / 1000) + 60;
            const cleanPublicId = publicId.replace(/\.pdf$/, "");
            // Try 'image' first (how Cloudinary v2 stores PDFs uploaded with resource_type:auto)
            // Fall back to 'raw' if the first attempt fails
            const tryFetch = (resourceType) => new Promise((resolve) => {
                const signedUrl = cloudinary.utils.private_download_url(cleanPublicId, "pdf", {
                    resource_type: resourceType,
                    type: "authenticated",
                    expires_at: expiresAt,
                });
                const mod = signedUrl.startsWith("https") ? https : http;
                const chunks = [];
                const req2 = mod.get(signedUrl, (r) => {
                    r.on("data", (chunk) => chunks.push(chunk));
                    r.on("end", () => resolve({ statusCode: r.statusCode ?? 0, headers: r.headers, body: Buffer.concat(chunks) }));
                });
                req2.on("error", () => resolve({ statusCode: 0, headers: {}, body: Buffer.alloc(0) }));
            });
            let result = await tryFetch("image");
            if (result.statusCode !== 200) {
                result = await tryFetch("raw");
            }
            if (result.statusCode !== 200 || result.body.length === 0) {
                console.error(`[streamDocument] Cloudinary fetch failed for ${publicId}, status=${result.statusCode}`);
                return res.status(502).json({ success: false, message: "Could not retrieve NID document from storage" });
            }
            // Stream PDF inline so the browser renders it (not downloads it)
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=\"nid-document.pdf\"");
            res.setHeader("Content-Length", result.body.length);
            res.setHeader("Cache-Control", "no-store");
            return res.end(result.body);
        }
        catch (err) {
            console.error("Error in streamDocument:", err);
            return res.status(500).json({ success: false, message: err.message || "Failed to stream document" });
        }
    }
}
export const adminVerificationController = new AdminVerificationController();
export default adminVerificationController;
