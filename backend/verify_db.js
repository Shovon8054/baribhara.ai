const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
(async ()=>{
  try {
    const info = await pool.query("SELECT current_database() AS db, inet_server_addr() AS host, inet_server_port() AS port");
    console.log('Connected DB:', info.rows[0]);
    const users = await pool.query('SELECT id,email,full_name,role,is_active FROM users ORDER BY created_at ASC');
    console.log('Users count:', users.rows.length);
    console.table(users.rows);
  } catch(err) {
    console.error('Error:', err.message || err);
  } finally {
    await pool.end();
  }
})();
