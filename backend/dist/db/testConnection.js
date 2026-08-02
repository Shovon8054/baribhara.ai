"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("./dbConnection"));
async function test() {
    try {
        // Ensure users table exists and optionally create a sample row if empty.
        await dbConnection_1.default.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await dbConnection_1.default.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'TENANT' CHECK (role IN ('TENANT', 'OWNER', 'ADMIN')),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await dbConnection_1.default.query(`INSERT INTO users (email, password, full_name, phone, role) VALUES ($1, $2, $3, $4, $5)`, ['manual@example.com', 'manualpassword', 'Manual User', '0987654321', 'OWNER']);
        console.log('Inserted manual user row into users table.');
        const res = await dbConnection_1.default.query('SELECT * FROM users');
        console.log('DB connection successful. Inserted users rows:');
        console.table(res.rows);
        await dbConnection_1.default.end();
        process.exit(0);
    }
    catch (err) {
        console.error('DB connection failed:', err);
        await dbConnection_1.default.end();
        process.exit(1);
    }
}
test();
