// =============================================================================
// CYBERSECURITY PRACTICAL LABS: BACKEND ROUTES
// Lab 1: SQL Injection (Login Portal & SQLmap Target)
// Lab 2: Cross-Site Scripting (Stored, Reflected, DOM-Based XSS)
// =============================================================================

const express = require('express');
const router = express.Router();
const { pool, checkConnection } = require('../database');

// Global state for defensive toggles (can also be passed per-request via ?mode=secure or { mode: 'secure' })
let globalSqliDefense = false;
let globalXssDefense = false;

// -----------------------------------------------------------------------------
// SYSTEM & DB HEALTH
// GET /api/health
// -----------------------------------------------------------------------------
router.get('/health', async (req, res) => {
  const dbStatus = await checkConnection();
  res.json({
    status: 'online',
    sqliMode: globalSqliDefense ? 'secure' : 'vulnerable',
    xssMode: globalXssDefense ? 'secure' : 'vulnerable',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Toggle global defense modes
router.post('/toggle-mode', (req, res) => {
  const { lab, mode } = req.body;
  if (lab === 'sqli') {
    globalSqliDefense = mode === 'secure' ? true : mode === 'vulnerable' ? false : !globalSqliDefense;
  } else if (lab === 'xss') {
    globalXssDefense = mode === 'secure' ? true : mode === 'vulnerable' ? false : !globalXssDefense;
  }
  res.json({
    success: true,
    sqliMode: globalSqliDefense ? 'secure' : 'vulnerable',
    xssMode: globalXssDefense ? 'secure' : 'vulnerable'
  });
});

// =============================================================================
// LAB 1: SQL INJECTION (LOGIN PORTAL & SQLMAP TARGET)
// Target Endpoints:
// - POST /api/sqli/login
// - GET  /api/sqli/login (supports both POST and GET for browser & SQLmap testing)
// =============================================================================

const handleSqliLogin = async (req, res) => {
  // Support both body (JSON/URL-encoded) and query parameters for SQLmap flexibility
  let username = req.body?.username ?? req.query?.username ?? '';
  let password = req.body?.password ?? req.query?.password ?? '';
  const isSecure = req.body?.mode === 'secure' || req.query?.mode === 'secure' || globalSqliDefense;

  // In MySQL/MariaDB, the '--' comment strictly requires a trailing whitespace character.
  // Standard web forms and users typing "admin' OR 1=1 --" often omit the trailing space.
  // Ensure '--' has a trailing space so classic payloads work without MySQL syntax errors:
  if (typeof username === 'string') {
    if (username.endsWith('--')) {
      username += ' ';
    }
    username = username.replace(/--(?!\s|$)/g, '-- ');
  }

  let executedSql = '';
  const startTime = Date.now();

  try {
    let rows;

    const column = username.includes('@') ? 'email' : 'username';

    if (!isSecure) {
      // =======================================================================
      // 🚨 VULNERABLE SQL QUERY (Dynamic String Concatenation)
      // Classic bypass payload: admin' -- or ' OR '1'='1' --
      // SQLmap injectable parameter: username and/or password
      // =======================================================================
      executedSql = `SELECT id, username, email, password, role FROM users WHERE ${column} = '${username}' AND password = '${password}'`;
      const [result] = await pool.query(executedSql);
      rows = result;
    } else {
      // =======================================================================
      // 🛡️ SECURE SQL QUERY (Parameterized Prepared Statement)
      // Input is bound as data bytes; quotes cannot escape query structure.
      // =======================================================================
      executedSql = `SELECT id, username, email, password, role FROM users WHERE ${column} = ? AND password = ?`;
      const [result] = await pool.execute(executedSql, [username, password]);
      rows = result;
    }

    const durationMs = Date.now() - startTime;
    const authenticated = Array.isArray(rows) && rows.length > 0;

    res.json({
      success: true,
      authenticated,
      mode: isSecure ? 'secure (parameterized)' : 'vulnerable (concatenated)',
      executedQuery: executedSql,
      inputsReceived: { username, password },
      user: authenticated ? rows[0] : null,
      matchesCount: Array.isArray(rows) ? rows.length : 0,
      executionTimeMs: durationMs,
      message: authenticated
        ? `Authentication SUCCESSFUL. Logged in as: ${rows[0].username} (${rows[0].role})`
        : 'Authentication FAILED. Invalid credentials.'
    });

  } catch (error) {
    // Return actual MySQL error message so students can demonstrate Error-Based SQLi!
    res.status(500).json({
      success: false,
      authenticated: false,
      mode: isSecure ? 'secure' : 'vulnerable',
      executedQuery: executedSql,
      inputsReceived: { username, password },
      error: error.message,
      sqlMessage: error.sqlMessage || error.message,
      sqlState: error.sqlState,
      code: error.code
    });
  }
};

router.post('/sqli/login', handleSqliLogin);
router.get('/sqli/login', handleSqliLogin);

// =============================================================================
// ADMIN USER MANAGEMENT ENDPOINTS
// - GET /api/sqli/users: Admin views all users & their passwords
// - DELETE /api/sqli/users/:id: Admin deletes a user
// - POST /api/sqli/reset-users: Restores demo user accounts
// =============================================================================
router.get('/sqli/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, password, role FROM users ORDER BY id ASC');
    res.json({
      success: true,
      users: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/sqli/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `User with ID ${id} deleted successfully.`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/sqli/reset-users', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    await pool.query(`
      INSERT INTO users (id, username, password, email, role) VALUES
      (1, 'admin', 'waheed', 'waheed@gmail.com', 'admin'),
      (2, 'abdul', '12345', 'abdul@gmail.com', 'user'),
      (3, 'sarah_j', 'Spring2026!', 'sarah.j@company.io', 'analyst'),
      (4, 'm_chang', 'ChangSecure#1', 'm.chang@techcorp.com', 'developer'),
      (5, 'emily_w', 'EmilyW#2026', 'emily.watson@enterprise.net', 'manager'),
      (6, 'david_m', 'Dav!dM1ller99', 'dmiller@financial.org', 'finance'),
      (7, 'jessica_t', 'TaylorSafe77!', 'jess.taylor@domain.com', 'user'),
      (8, 'robert_w', 'RobWils0n#pass', 'rwilson@securityhub.io', 'developer'),
      (9, 'amanda_m', 'AmandaM@123', 'amanda.m@cloudsys.net', 'user'),
      (10, 'james_a', 'JAnderson!88', 'j.anderson@network.org', 'support'),
      (11, 'lisa_t', 'LisaT#Pass2026', 'lisa.t@datastack.io', 'marketing'),
      (12, 'daniel_j', 'DanJ@ckson44!', 'djackson@corpnet.com', 'analyst'),
      (13, 'sophia_w', 'SophiaW#991', 'sophia.w@globaltech.com', 'user'),
      (14, 'kevin_h', 'Kev!nHarris12', 'kharris@cybersec.org', 'developer'),
      (15, 'olivia_m', 'OliviaM#554', 'olivia.m@apexservices.net', 'user'),
      (16, 'brian_c', 'BrianC!pass7', 'bclark@logixcorp.com', 'finance'),
      (17, 'rachel_l', 'RachelL#2026!', 'rachel.lewis@innovate.io', 'user')
    `);
    const [rows] = await pool.query('SELECT id, username, email, password, role FROM users ORDER BY id ASC');
    res.json({ success: true, message: 'Demonstration users restored successfully.', users: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// LAB 1: PRODUCTS & CATEGORIES (SQLMAP TARGET WITH ?category=glasses)
// Target Endpoints:
// - GET /api/sqli/products?category=glasses (or ?catagory=glasses)
// - GET /api/sqli/categories
// =============================================================================
router.get('/sqli/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM categories ORDER BY id ASC');
    res.json({
      success: true,
      categories: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sqli/products', async (req, res) => {
  let categoryParam = req.query.category ?? req.query.catagory ?? '';
  const isSecure = req.query.mode === 'secure' || req.body?.mode === 'secure' || globalSqliDefense;
  let executedSql = '';

  if (typeof categoryParam === 'string') {
    if (categoryParam.endsWith('--')) {
      categoryParam += ' ';
    }
    categoryParam = categoryParam.replace(/--(?!\s|$)/g, '-- ');
  }

  try {
    let rows = [];

    if (!categoryParam || categoryParam.toLowerCase() === 'all') {
      executedSql = `SELECT p.id, p.name, p.price, p.stock, c.name AS category 
                     FROM products p 
                     JOIN categories c ON p.category_id = c.id 
                     ORDER BY p.id ASC`;
      const [result] = await pool.query(executedSql);
      rows = result;
    } else if (!isSecure) {
      // =======================================================================
      // 🚨 VULNERABLE SQL QUERY (Dynamic String Concatenation)
      // SQLmap target: http://127.0.0.1:3001/api/sqli/products?category=glasses
      // Classic bypass: glasses' OR '1'='1' -- 
      // =======================================================================
      executedSql = `SELECT p.id, p.name, p.price, p.stock, c.name AS category 
                     FROM products p 
                     JOIN categories c ON p.category_id = c.id 
                     WHERE c.name = '${categoryParam}' 
                     ORDER BY p.id ASC`;
      const [result] = await pool.query(executedSql);
      rows = result;
    } else {
      // =======================================================================
      // 🛡️ SECURE SQL QUERY (Parameterized Prepared Statement)
      // =======================================================================
      executedSql = `SELECT p.id, p.name, p.price, p.stock, c.name AS category 
                     FROM products p 
                     JOIN categories c ON p.category_id = c.id 
                     WHERE LOWER(c.name) = LOWER(?) 
                     ORDER BY p.id ASC`;
      const [result] = await pool.execute(executedSql, [categoryParam]);
      rows = result;
    }

    res.json({
      success: true,
      count: rows.length,
      category: categoryParam || 'all',
      executedQuery: executedSql,
      mode: isSecure ? 'secure (parameterized)' : 'vulnerable (concatenated)',
      products: rows
    });
  } catch (error) {
    // Return MySQL error for error-based SQLi demonstrations
    res.status(500).json({
      success: false,
      error: error.message,
      sqlMessage: error.sqlMessage || error.message,
      sqlState: error.sqlState,
      code: error.code,
      executedQuery: executedSql
    });
  }
});

// Reference data for Lab 1 (shows available tables & records when requested)
router.get('/sqli/tables-overview', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role FROM users');
    const [products] = await pool.query('SELECT id, name, price, stock FROM products');
    const [categories] = await pool.query('SELECT id, name, description FROM categories');
    const [orders] = await pool.query('SELECT id, user_id, total, status FROM orders');

    res.json({
      success: true,
      database: 'sql_injection_lab',
      tables: {
        users,
        products,
        categories,
        orders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// LAB 2: CROSS-SITE SCRIPTING (XSS)
// 1. Stored XSS: Comments persistent in MySQL
// 2. Reflected XSS: URL parameter reflection
// 3. DOM-Based XSS: Client-side URL fragment/DOM sink demonstration
// =============================================================================

// GET /api/xss/comments — Retrieve stored comments
router.get('/xss/comments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, comment, created_at FROM comments ORDER BY id ASC'
    );
    res.json({
      success: true,
      count: rows.length,
      comments: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/xss/comments — Store comment in MySQL
router.post('/xss/comments', async (req, res) => {
  const username = req.body?.username?.trim() || 'Anonymous Reader';
  const comment = req.body?.comment ?? '';

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, error: 'Comment content cannot be empty.' });
  }

  try {
    // Uses parameterized query to store the raw comment safely into MySQL
    const [result] = await pool.execute(
      'INSERT INTO comments (username, comment) VALUES (?, ?)',
      [username, comment]
    );

    res.status(201).json({
      success: true,
      message: 'Comment posted and saved to MySQL database.',
      comment: {
        id: result.insertId,
        username,
        comment,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/xss/comments — Reset comments to clean defaults
router.delete('/xss/comments', async (req, res) => {
  try {
    await pool.query('DELETE FROM comments');
    await pool.execute(
      `INSERT INTO comments (username, comment) VALUES 
       ('Sarah Chen (Lead Cloud Architect at CloudScale)', 'Abdul conducted our pre-launch application security audit and identified key architectural edge cases before production. Invaluable expertise!'),
       ('Marcus Vance (VP of Engineering at FinSecure)', 'Exceptional engineer with a deep understanding of zero-trust architecture, defensive software design, and modern cloud security.')`
    );
    res.json({
      success: true,
      message: 'Guestbook endorsements reset to baseline.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/xss/reflected — Reflected XSS Endpoint
// Returns unescaped query string directly for demonstration
router.get('/xss/reflected', (req, res) => {
  const query = req.query.q || '';
  const isSecure = req.query.mode === 'secure' || globalXssDefense;

  if (isSecure) {
    // Secure: Escapes special characters
    const escaped = String(query)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return res.json({
      success: true,
      mode: 'secure (encoded)',
      reflectedQuery: escaped,
      rawQuery: query
    });
  }

  // Vulnerable: Returns raw string
  res.json({
    success: true,
    mode: 'vulnerable (raw reflection)',
    reflectedQuery: query,
    rawQuery: query
  });
});

// Backwards-compatibility aliases for existing Phase 1 & 2 components
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, role FROM users');
    res.json({ success: true, count: rows.length, users: rows });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
router.get('/comments', (req, res) => res.redirect('/api/xss/comments'));
router.post('/comments', (req, res) => res.redirect(307, '/api/xss/comments'));
router.delete('/comments', (req, res) => res.redirect(307, '/api/xss/comments'));
router.post('/login', handleSqliLogin);
router.get('/login', handleSqliLogin);

module.exports = router;
