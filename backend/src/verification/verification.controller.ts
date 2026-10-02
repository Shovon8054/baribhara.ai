import { Request, Response } from "express";
import { ZodError } from "zod";
import verificationService from "./verification.service.js";
import {
  submitVerificationSchema,
  reviewVerificationSchema,
} from "./verification.validation.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class VerificationController {
  /**
   * Get current verification status and history for the logged-in user.
   */
  async getStatus(req: AuthRequest, res: Response) {
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
    } catch (err: any) {
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
  async submit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Validate request body
      const validatedData = submitVerificationSchema.parse(req.body);

      const result = await verificationService.submitVerification(
        userId,
        validatedData,
        req.file
      );

      return res.status(201).json({
        success: true,
        message: "Verification submitted successfully and is pending review.",
        data: result,
      });
    } catch (err: any) {
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
  async getHistory(req: AuthRequest, res: Response) {
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
    } catch (err: any) {
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
  async getAll(req: AuthRequest, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const records = await verificationService.getAllVerifications({ status });
      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (err: any) {
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
  async review(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.id;
      const id = req.params.id as string;

      if (!adminId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: "Verification ID is required" });
      }

      const validatedData = reviewVerificationSchema.parse(req.body);
      const updated = await verificationService.reviewVerification(
        id,
        adminId,
        validatedData
      );

      return res.status(200).json({
        success: true,
        message: `Verification marked as ${validatedData.status}`,
        data: updated,
      });
    } catch (err: any) {
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
