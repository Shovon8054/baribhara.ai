"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
const signin_service_1 = __importDefault(require("./signin.service"));
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await signin_service_1.default.login(email, password);
        res.cookie("auth_token", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: result.user,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(401).json({
            success: false,
            message,
        });
    }
}
async function logout(req, res) {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
