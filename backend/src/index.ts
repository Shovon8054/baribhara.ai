import dotenv from "dotenv";
import path from "path";
import http from "http";

import { Server } from "socket.io";

import app from "./app.js";
import pool from "./db/dbConnection.js";
import { initializeChatSocket } from "./chat/chat.socket.js";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    "../.env"
  ),
});

const HOST =
  process.env.HOST ||
  "0.0.0.0";

const BASE_PORT =
  Number(process.env.PORT) ||
  8080;

// =====================================
// START SERVER
// =====================================

const startServer = (
  port: number
) => {
  // Create HTTP server
  const httpServer =
    http.createServer(app);

  // =================================
  // SOCKET.IO
  // =================================

  const io =
    new Server(
      httpServer,
      {
        cors: {
          origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (origin.endsWith(".vercel.app")) return callback(null, true);
            const allowed = [
              process.env.FRONTEND_URL,
              "http://localhost:5173",
              "http://127.0.0.1:5173",
            ].filter(Boolean);
            if (allowed.includes(origin)) return callback(null, true);
            callback(new Error(`Socket CORS: origin ${origin} not allowed`));
          },
          methods: ["GET", "POST", "PATCH"],
          credentials: true,
        },
      }
    );

  // Initialize Chat Socket Event Handlers
  initializeChatSocket(io);

  // =====================================
  // START HTTP + SOCKET.IO SERVER
  // =====================================

  httpServer.listen(
    port,
    HOST,
    () => {
      console.log(
        `Server running on http://${HOST}:${port}`
      );

      console.log(
        `Socket.IO running on http://${HOST}:${port}`
      );
    }
  );

  // =====================================
  // ERROR HANDLING
  // =====================================

  httpServer.on(
    "error",
    (error: NodeJS.ErrnoException) => {
      if (
        error.code ===
        "EADDRINUSE" &&
        port < BASE_PORT + 10
      ) {
        console.warn(
          `Port ${port} is already in use. Trying ${port + 1}...`
        );

        httpServer.close();

        startServer(
          port + 1
        );

        return;
      }

      console.error(
        "Server failed to start:",
        error
      );

      process.exit(1);
    }
  );
};

// =====================================
// DATABASE
// =====================================

const initializeApp =
  async () => {
    try {
      const client =
        await pool.connect();

      await client.query(
        "SELECT 1"
      );

      client.release();

      console.log(
        "DB connected successfully"
      );

      startServer(
        BASE_PORT
      );
    } catch (error) {
      console.error(
        "Failed to connect to DB:",
        error
      );

      process.exit(1);
    }
  };

initializeApp();