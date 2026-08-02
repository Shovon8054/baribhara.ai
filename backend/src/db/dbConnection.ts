import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'


dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 8080,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'baribhara',
  max: 10,
  idleTimeoutMillis: 30000,
})

export default pool
