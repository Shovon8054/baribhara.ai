import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const pool = new Pool(process.env.DATABASE_URL
    ? {
        // Render / production: use the DATABASE_URL connection string
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Render managed PostgreSQL
        max: 10,
        idleTimeoutMillis: 30000,
    }
    : {
        // Local development: individual env vars
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'baribhara',
        max: 10,
        idleTimeoutMillis: 30000,
    });
export default pool;
