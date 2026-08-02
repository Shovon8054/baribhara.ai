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
    console.log('ENV DB:', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_NAME);
    const dbRes = await pool.query('SELECT current_database() AS db, inet_server_addr() AS host, inet_server_port() AS port');
    console.log('Connected DB info:', dbRes.rows[0]);
    const usersExist = await pool.query("SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema='public' AND table_name='users'");
    console.log('users table exists:', usersExist.rows[0].count);
    if (usersExist.rows[0].count > 0) {
      const sample = await pool.query('SELECT id,email,full_name,role,is_active FROM users LIMIT 5');
      console.log('Sample users:', sample.rows);
    }
  } catch (err) {
    console.error('DB query error:', err.message || err);
  } finally {
    await pool.end();
  }
})();
