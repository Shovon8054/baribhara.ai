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
    const res = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname");
    console.log('Databases on server:');
    console.table(res.rows);
  } catch(err) {
    console.error('Error:', err.message || err);
  } finally {
    await pool.end();
  }
})();
