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

import bcrypt from "bcryptjs";

const ensureAdminUser = async () => {
  try {
    const email = "admin@baribhara.ai";
    const password = "Admin1234";
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (email, password, full_name, role, is_verified, is_active)
         VALUES ($1, $2, 'BashaBhara Admin', 'ADMIN', true, true)`,
        [email, hashedPassword]
      );
      console.log("Admin user admin@baribhara.ai created successfully.");
    } else {
      await pool.query(
        `UPDATE users SET password = $1, role = 'ADMIN', is_verified = true, is_active = true WHERE email = $2`,
        [hashedPassword, email]
      );
      console.log("Admin user admin@baribhara.ai password updated successfully.");
    }
  } catch (err) {
    console.error("Failed to ensure admin user:", err);
  }
};

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

      await ensureAdminUser();

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