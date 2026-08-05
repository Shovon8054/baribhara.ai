import aiService from "./ai.service.js";
import propertyService from "../property-listing/property.service.js";
const aiController = {
    async search(req, res) {
        try {
            const { query } = req.body;
            if (typeof query !== "string" || !query.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Query is required",
                });
            }
            const filters = await aiService.extractFilters(query.trim());
            const properties = await propertyService.searchProperties(filters);
            res.json({
                success: true,
                filters,
                data: properties,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            const status = error instanceof Error && error.message === "GEMINI_API_KEY is not configured"
                ? 503
                : 500;
            res.status(status).json({
                success: false,
                message,
            });
        }
    },
};
export default aiController;
