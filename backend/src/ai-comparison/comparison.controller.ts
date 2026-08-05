import { Request, Response } from "express";
import comparisonService from "./comparison.service.js";

const comparisonController = {
  async compare(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const result = await comparisonService.compareProperties(userId);

      res.status(200).json({
        success: true,
        comparison: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  },
};

export default comparisonController;