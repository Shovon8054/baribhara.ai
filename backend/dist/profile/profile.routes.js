"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = __importDefault(require("./profile.controller"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, profile_controller_1.default.getProfile);
router.get("/properties", authMiddleware_1.default, profile_controller_1.default.getMyProperties);
exports.default = router;
