"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../auth/signup/auth.routes"));
const signin_routes_1 = __importDefault(require("../auth/signin/signin.routes"));
const property_routes_1 = __importDefault(require("../property-listing/property.routes"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const property_controller_1 = __importDefault(require("../property-listing/property.controller"));
const profile_routes_1 = __importDefault(require("../profile/profile.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
// POST http://localhost:8083/api/auth/register
router.use("/auth", signin_routes_1.default);
// POST http://localhost:8081/api/auth/login
// Protect all non-auth routes
router.use(authMiddleware_1.default);
router.use("/property", property_routes_1.default);
router.get("/", property_controller_1.default.getAllProperties);
router.use("/profile", profile_routes_1.default);
// console.log("Main routes loaded");
exports.default = router;
