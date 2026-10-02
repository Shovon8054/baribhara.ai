import dotenv from "dotenv";
import path from "path";
import http from "http";

import { Server } from "socket.io";

import app from "./app.js";
import pool from "./db/dbConnection.js";
import { initializeChatSocket } from "./chat/chat.socket.js";

// Load .env from project root for local dev.
// On Render/production, env vars are injected directly — dotenv is a no-op.
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") }); // fallback: backend/.env

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

const ensureDefaultUsers = async () => {
  try {
    const demoAccounts = [
      {
        email: "admin@baribhara.ai",
        password: "Admin1234",
        full_name: "BashaBhara Admin",
        phone: "01700000001",
        role: "ADMIN",
      },
      {
        email: "tenant@bashabhara.com",
        password: "Tenant1234",
        full_name: "Saqline (Tenant)",
        phone: "+8801812345678",
        role: "TENANT",
      },
      {
        email: "owner@bashabhara.com",
        password: "Owner1234",
        full_name: "Shovon (Owner)",
        phone: "+8801712345678",
        role: "OWNER",
      },
    ];

    for (const acc of demoAccounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      const checkRes = await pool.query("SELECT id FROM users WHERE email = $1", [acc.email]);
      const isVerified = acc.role === "ADMIN";
      if (checkRes.rows.length === 0) {
        await pool.query(
          `INSERT INTO users (email, password, full_name, phone, role, is_verified, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [acc.email, hashedPassword, acc.full_name, acc.phone, acc.role, isVerified]
        );
        console.log(`Demo user ${acc.email} (${acc.role}) created successfully.`);
      } else {
        await pool.query(
          `UPDATE users SET password = $1, role = $2, full_name = $3, is_active = true WHERE email = $4`,
          [hashedPassword, acc.role, acc.full_name, acc.email]
        );
        console.log(`Demo user ${acc.email} (${acc.role}) credentials verified/updated.`);
      }
    }
  } catch (err) {
    console.error("Failed to ensure default demo users:", err);
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

      await ensureDefaultUsers();

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