import { Request, Response } from "express";
import profileService from "./profile.service.js";

const profileController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const profile = await profileService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  },

  async getMyProperties(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const properties =
        await profileService.getMyProperties(userId);

      res.status(200).json({
        success: true,
        count: properties.length,
        data: properties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch properties",
      });
    }
  },
};

export default profileController;
