import { Request, Response } from "express";
import adminPropertyService from "./adminProperty.service.js";

class AdminPropertyController {

    // GET /api/admin/properties
    async getAllProperties(
        req: Request,
        res: Response
    ) {
        try {

            const properties =
                await adminPropertyService.getAllProperties();

            return res.status(200).json({
                success: true,
                message: "Properties fetched successfully",
                data: properties
            });

        } catch (error) {

            console.error(
                "Get admin properties error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch properties"
            });
        }
    }


    // DELETE /api/admin/properties/:id
    async deleteProperty(
        req: Request,
        res: Response
    ) {
        try {

            const { id } = req.params as { id: string };

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Property ID is required"
                });
            }

            const property =
                await adminPropertyService.deleteProperty(id);

            return res.status(200).json({
                success: true,
                message: "Property deleted successfully",
                data: property
            });

        } catch (error: any) {

            console.error(
                "Delete admin property error:",
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Failed to delete property"
            });
        }
    }
}

export default new AdminPropertyController();