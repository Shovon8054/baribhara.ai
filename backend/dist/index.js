"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const dbConnection_1 = __importDefault(require("./db/dbConnection"));
dotenv_1.default.config({ path: require('path').resolve(__dirname, '../../.env') });
const HOST = process.env.HOST || '0.0.0.0';
const BASE_PORT = Number(process.env.PORT) || 8080;
const startServer = (port) => {
    const server = app_1.default.listen(port, HOST, () => {
        console.log(`Server running on http://${HOST}:${port}`);
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && port < BASE_PORT + 10) {
            console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
            server.close();
            startServer(port + 1);
            return;
        }
        console.error('Server failed to start:', error);
        process.exit(1);
    });
};
const initializeApp = async () => {
    try {
        const client = await dbConnection_1.default.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('DB connected successfully');
        startServer(BASE_PORT);
    }
    catch (error) {
        console.error('Failed to connect to DB:', error);
        process.exit(1);
    }
};
initializeApp();
