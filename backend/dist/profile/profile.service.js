"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../db/dbConnection"));
class ProfileService {
    async getProfile(userId) {
        const result = await dbConnection_1.default.query(`
        SELECT id, full_name AS name, email, phone, role
        FROM users
        WHERE id = $1
      `, [userId]);
        if (result.rows.length === 0) {
            throw new Error("User profile not found");
        }
        return result.rows[0];
    }
    async getMyProperties(userId) {
        const result = await dbConnection_1.default.query(`
        SELECT id, title, price, location, bedrooms, bathrooms, area, images, availability
        FROM properties
        WHERE owner_id = $1
        ORDER BY created_at DESC
      `, [userId]);
        return result.rows;
    }
}
exports.default = new ProfileService();
