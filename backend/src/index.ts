import dotenv from 'dotenv';
import path from 'path';
import app from './app.js';
import pool from './db/dbConnection.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const HOST = process.env.HOST || '0.0.0.0';
const BASE_PORT = Number(process.env.PORT) || 8080;

const startServer = (port: number) => {
  const server = app.listen(port, HOST, () => {
    console.log(`Server running on http://${HOST}:${port}`);
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
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
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    console.log('DB connected successfully');
    startServer(BASE_PORT);
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    process.exit(1);
  }
};

initializeApp();
