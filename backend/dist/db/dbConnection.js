import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const isProduction = process.env.NODE_ENV === 'production';
// Build connection string from individual vars if DATABASE_URL is not set.
// Supabase pooler requires the full connection string format to correctly
// route the tenant (username contains the project reference).
const getConnectionConfig = () => {
    if (process.env.DATABASE_URL) {
        return {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
        };
    }
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'postgres';
    if (isProduction) {
        // Use a full connection string in production — required for Supabase pooler
        // to correctly identify the tenant from the username.
        const connectionString = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?sslmode=require`;
        return {
            connectionString,
            ssl: { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
        };
    }
    // Local dev: use individual params, no SSL
    return {
        host,
        port: Number(port),
        user,
        password,
        database,
        ssl: false,
        max: 10,
        idleTimeoutMillis: 30000,
    };
};
const pool = new Pool(getConnectionConfig());
export default pool;
