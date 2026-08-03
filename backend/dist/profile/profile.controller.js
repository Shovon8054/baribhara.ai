"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_service_1 = __importDefault(require("./profile.service"));
const profileController = {
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await profile_service_1.default.getProfile(userId);
            res.status(200).json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch profile",
            });
        }
    },
    async getMyProperties(req, res) {
        try {
            const userId = req.user.id;
            const properties = await profile_service_1.default.getMyProperties(userId);
            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch properties",
            });
        }
    },
};
exports.default = profileController;
