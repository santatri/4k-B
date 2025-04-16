require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false },
  enableKeepAlive: true
});

// Test de connexion au démarrage
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connecté via mysql2 (Promise)');
    conn.release();
  } catch (err) {
    console.error('❌ ERREUR MySQL:', {
      code: err.code,
      message: err.message,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        db: process.env.DB_NAME
      }
    });
    process.exit(1);
  }
})();

// Fonction helper pour les requêtes
pool.queryAsync = async (sql, params) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = pool;