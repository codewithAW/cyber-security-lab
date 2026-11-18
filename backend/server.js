// =============================================================================
// Cybersecurity Attack & Defense Lab — Isolated Express Backend
// Host: 127.0.0.1 (Loopback only for security)
// Port: 3001
// Purpose: Educational demonstration of SQL Injection attacks and defenses
// =============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { checkConnection } = require('./database');
const labRoutes = require('./routes/labRoutes');

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '127.0.0.1'; // Strictly loopback

// Middleware: CORS restricted to local development origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-instructor-key']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Educational Request Logger (prints to terminal for student demonstration)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount Lab API Routes
app.use('/api', labRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    lab: 'Cybersecurity Attack & Defense Lab (Unified Phase 1 & Phase 2)',
    status: 'online',
    endpoints: {
      health: '/api/health',
      // Phase 1: SQL Injection
      allUsers: '/api/users',
      recordLookup: '/api/users/search?id=1',
      login: '/api/login',
      modeToggle: '/api/mode',
      // Phase 2: Stored XSS
      comments: '/api/comments'
    },
    safetyNotice: 'This lab runs strictly on isolated loopback for authorized educational demonstration only.'
  });
});

// Start Server on loopback
const server = app.listen(PORT, HOST, async () => {
  console.log('=================================================================');
  console.log('🛡️  CYBERSECURITY ATTACK & DEFENSE LAB — BACKEND ACTIVE');
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log('🔒 Loopback isolation: ACTIVE (127.0.0.1 only)');
  console.log('=================================================================');

  const dbStatus = await checkConnection();
  if (dbStatus.connected) {
    console.log(`✅ MySQL Connected: ${dbStatus.version} via ${dbStatus.transport}`);
    console.log(`📦 Database: ${dbStatus.database} | User: ${dbStatus.user}`);
  } else {
    console.error(`❌ MySQL Connection Error: ${dbStatus.error}`);
    console.error('👉 Make sure MySQL/MariaDB service is running.');
  }
  console.log('=================================================================');
});

module.exports = app;

