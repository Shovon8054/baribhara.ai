"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const authController = {
    async register(req, res) {
        try {
            const { name, email, password, phone, role } = req.body;
            const result = await auth_service_1.default.register({
                full_name: name,
                email,
                password,
                phone,
                role,
            });
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
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
exports.default = authController;
