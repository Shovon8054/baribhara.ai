"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signin_controller_1 = require("./signin.controller");
const router = (0, express_1.Router)();
router.post("/login", signin_controller_1.login);
router.post("/logout", signin_controller_1.logout);
exports.default = router;
