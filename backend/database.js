// =============================================================================
// Cybersecurity Attack & Defense Lab — Database Connection Module
// Technology: MySQL2 / Promise Pool
// Target: Isolated sql_injection_lab database
// User: sql_lab_user (Principle of Least Privilege: SELECT, INSERT only)
// =============================================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Determine connection strategy: Unix domain socket or TCP loopback
const socketCandidates = [
  process.env.DB_SOCKET,
  '/tmp/mysql.sock',
  '/var/run/mysqld/mysqld.sock'
];

let chosenSocket = null;
for (const sock of socketCandidates) {
  if (sock && fs.existsSync(sock)) {
    chosenSocket = sock;
    break;
  }
}

const poolConfig = {
  user: process.env.DB_USER || 'sql_lab_user',
  password: process.env.DB_PASSWORD || 'LabSecurePass2026!',
  database: process.env.DB_NAME || 'sql_injection_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Educational settings: allow multiple statements if needed for demonstrations
  multipleStatements: true
};

if (chosenSocket) {
  poolConfig.socketPath = chosenSocket;
} else {
  poolConfig.host = process.env.DB_HOST || '127.0.0.1';
  poolConfig.port = parseInt(process.env.DB_PORT || '3306', 10);
}

const pool = mysql.createPool(poolConfig);

/**
 * Health check & diagnostics helper
 */
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() AS version, DATABASE() AS currentDb, CURRENT_USER() AS currentUser');
    connection.release();
    return {
      connected: true,
      version: rows[0].version,
      database: rows[0].currentDb,
      user: rows[0].currentUser,
      transport: chosenSocket ? `Unix Socket (${chosenSocket})` : `TCP (${poolConfig.host}:${poolConfig.port})`
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      code: error.code,
      transport: chosenSocket ? `Unix Socket (${chosenSocket})` : `TCP (${poolConfig.host}:${poolConfig.port})`
    };
  }
}

module.exports = {
  pool,
  checkConnection
};

