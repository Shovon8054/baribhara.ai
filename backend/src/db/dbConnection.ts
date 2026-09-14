import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const isProduction = process.env.NODE_ENV === 'production'

const getConnectionConfig = () => {
  // ── PATH A: DATABASE_URL is set (Render internal DB or full connection string) ──
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      // rejectUnauthorized: false allows self-signed certs (Supabase / Render pooler).
      // Do NOT embed ?sslmode= in the URL — pg v8 on Node 18+ treats sslmode=require
      // as verify-full, which ignores rejectUnauthorized and causes SELF_SIGNED_CERT_IN_CHAIN.
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    }
  }

  const host     = process.env.DB_HOST     || 'localhost'
  const port     = process.env.DB_PORT     || '5432'
  const user     = process.env.DB_USER     || 'postgres'
  const password = process.env.DB_PASSWORD || ''
  const database = process.env.DB_NAME     || 'postgres'

  // ── PATH B: Individual env vars in production (e.g. Supabase via Render dashboard) ──
  if (isProduction) {
    // Build the connection string WITHOUT ?sslmode — let the ssl option below handle TLS.
    // Embedding ?sslmode=require causes pg v8 to activate libpq-style verify-full,
    // which overrides rejectUnauthorized and triggers SELF_SIGNED_CERT_IN_CHAIN.
    const connectionString =
      `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}` +
      `@${host}:${port}/${database}`

    return {
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    }
  }

  // ── PATH C: Local development — plain TCP, no SSL ──
  return {
    host,
    port:     Number(port),
    user,
    password,
    database,
    ssl:      false as false,
    max:      10,
    idleTimeoutMillis: 30000,
  }
}

const pool = new Pool(getConnectionConfig())

export default pool
