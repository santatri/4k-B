require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    'https://4kdesigns-mada.com',
    'https://4kfront.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check (Async/Await)
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 + 1 AS test');
    res.json({
      status: 'OK',
      db: 'Connected',
      testResult: result[0].test,
      env: process.env.NODE_ENV
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message,
      dbConfig: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
      }
    });
  }
});

// Routes (Exemple avec async/await)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/ClientRoute'));
app.use('/api/factures', require('./routes/factureRoutes'));
app.use('/api/produits', require('./routes/ProduitRoutes'));

// Gestion des erreurs
app.use((req, res) => res.status(404).json({ error: "Endpoint non trouvé" }));
app.use((err, req, res, next) => {
  console.error('🔥 Erreur:', err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
server.listen(port, () => {
  console.log(`\n🚀 Server running on port ${port}`);
  console.log(`🔗 Environnement: ${process.env.NODE_ENV}`);
  console.log(`🗄️  DB Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
});