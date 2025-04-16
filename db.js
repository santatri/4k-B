require('dotenv').config();

// db.js
const mysql = require('mysql2/promise'); // Version avec support Promises

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }, // Obligatoire pour Railway/Render
  enableKeepAlive: true // Améliore la stabilité des connexions
});

// Test de connexion immédiat
pool.getConnection()
  .then(conn => {
    console.log('✅ Connexion MySQL établie avec mysql2');
    conn.release();
  })
  .catch(err => {
    console.error('❌ ERREUR MYSQL:', {
      code: err.code,
      message: err.message,
      stack: err.stack,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        db: process.env.DB_NAME
      }
    });
    process.exit(1);
  });

module.exports = pool;