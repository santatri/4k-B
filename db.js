require('dotenv').config();

// db.js (version optimisée)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false },
  enableKeepAlive: true
});

// Fonction wrapper pour les requêtes
pool.executeQuery = async (sql, params) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = pool;