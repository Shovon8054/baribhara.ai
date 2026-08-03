"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../../db/dbConnection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService = {
    async register(user) {
        const { full_name, email, password, phone = null, role = "TENANT" } = user;
        const normalizedRole = (() => {
            const upperRole = role.toUpperCase();
            const allowedRoles = ["TENANT", "OWNER", "ADMIN"];
            if (!allowedRoles.includes(upperRole)) {
                throw new Error(`Invalid role. Allowed values are: ${allowedRoles.join(", ")}`);
            }
            return upperRole;
        })();
        const existingUser = await dbConnection_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await dbConnection_1.default.query(`
      INSERT INTO users(full_name, email, password, phone, role)
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, phone, role
      `, [full_name, email, hashedPassword, phone, normalizedRole]);
        const newUser = result.rows[0];
        const accessToken = jsonwebtoken_1.default.sign({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return {
            user: newUser,
            accessToken,
        };
    },
};
exports.default = authService;
