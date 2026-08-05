import detailsService from "./details.service.js";
const detailsController = {
    async getPropertyDetails(req, res) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Invalid property ID format",
                });
            }
            const property = await detailsService.getPropertyDetails(id);
            res.status(200).json({
                success: true,
                data: property,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(404).json({
                success: false,
                message,
            });
        }
    },
};
export default detailsController;
