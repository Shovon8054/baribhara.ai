import favoriteService from "./favorite.service.js";
const favoriteController = {
    async addToFavorites(req, res) {
        try {
            const userId = req.user.id;
            const { propertyId } = req.params;
            if (typeof propertyId !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid property ID",
                });
            }
            const favorite = await favoriteService.addToFavorites(userId, propertyId);
            res.status(favorite.created ? 201 : 200).json({
                success: true,
                message: favorite.created ? "Added to favorites" : "Property is already in favorites",
                data: favorite,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(400).json({
                success: false,
                message,
            });
        }
    },
    async getFavorites(req, res) {
        try {
            const userId = req.user.id;
            const favorites = await favoriteService.getFavorites(userId);
            res.status(200).json({
                success: true,
                count: favorites.length,
                data: favorites,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(500).json({
                success: false,
                message,
            });
        }
    },
    async removeFavorite(req, res) {
        try {
            const userId = req.user.id;
            const { propertyId } = req.params;
            if (typeof propertyId !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid property ID",
                });
            }
            await favoriteService.removeFavorite(userId, propertyId);
            res.status(200).json({
                success: true,
                message: "Removed from favorites",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(400).json({
                success: false,
                message,
            });
        }
    },
};
export default favoriteController;
