import pool from './dbConnection'

async function test() {
  try {
    // Ensure users table exists and optionally create a sample row if empty.
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await pool.query(`
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
    `)

    await pool.query(
      `INSERT INTO users (email, password, full_name, phone, role) VALUES ($1, $2, $3, $4, $5)`,
      ['manual@example.com', 'manualpassword', 'Manual User', '0987654321', 'OWNER']
    )
    console.log('Inserted manual user row into users table.')

    const res = await pool.query('SELECT * FROM users')
    console.log('DB connection successful. Inserted users rows:')
    console.table(res.rows)
    await pool.end()
    process.exit(0)
  } catch (err) {
    console.error('DB connection failed:', err)
    await pool.end()
    process.exit(1)
  }
}

test()
