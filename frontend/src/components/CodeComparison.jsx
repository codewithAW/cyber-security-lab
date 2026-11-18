import React, { useState } from 'react';
import { 
  Code2, 
  ShieldAlert, 
  ShieldCheck, 
  FileCode, 
  Copy, 
  Check, 
  Terminal,
  BookOpen
} from 'lucide-react';

export function CodeComparison() {
  const [selectedSnippet, setSelectedSnippet] = useState('lookup'); // 'lookup' or 'login'
  const [copied, setCopied] = useState(false);

  const snippets = {
    lookup: {
      file: "cybersecurity-lab/backend/routes/labRoutes.js",
      vulnerableLines: "Lines 68-71",
      secureLines: "Lines 78-81",
      vulnerableCode: `// 🚨 VULNERABLE: Direct string interpolation into SQL
const executedQuery = \`SELECT id, username, role, note 
                       FROM users 
                       WHERE id = \${rawId}\`;

const [result] = await pool.query(executedQuery);`,
      secureCode: `// 🛡️ SECURE: Prepared statement with '?' placeholder
const executedQuery = \`SELECT id, username, role, note 
                       FROM users 
                       WHERE id = ?\`;

const [result] = await pool.execute(executedQuery, [rawId]);`,
      explanation: "In the vulnerable version, `${rawId}` is treated as raw SQL instructions by the MySQL parser. In the secure version, `?` is compiled by MySQL first, and `[rawId]` is delivered separately as literal data bytes."
    },
    login: {
      file: "cybersecurity-lab/backend/routes/labRoutes.js",
      vulnerableLines: "Lines 132-135",
      secureLines: "Lines 142-145",
      vulnerableCode: `// 🚨 VULNERABLE: Direct string concatenation for auth
const executedQuery = \`SELECT id, username, role, note 
                       FROM users 
                       WHERE username = '\${username}' 
                         AND password = '\${password}'\`;

const [result] = await pool.query(executedQuery);`,
      secureCode: `// 🛡️ SECURE: Parameterized authentication query
const executedQuery = \`SELECT id, username, role, note 
                       FROM users 
                       WHERE username = ? 
                         AND password = ?\`;

const [result] = await pool.execute(executedQuery, [username, password]);`,
      explanation: "In the vulnerable query, entering admin' -- turns the SQL logic into WHERE username = 'admin' /* comment */, bypassing the password check. The parameterized version binds both inputs to separate positional placeholders, preventing quotes from altering syntax."
    }
  };

  const current = snippets[selectedSnippet];

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon purple">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="card-title">Instructor Live Presentation Reference: Vulnerable vs Secure Code</h2>
            <p className="card-desc">
              Exact source code location and lines to modify during live college lectures to demonstrate remediation.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`payload-chip ${selectedSnippet === 'lookup' ? 'legit' : ''}`}
            onClick={() => setSelectedSnippet('lookup')}
          >
            Record Lookup Query
          </button>
          <button
            className={`payload-chip ${selectedSnippet === 'login' ? 'legit' : ''}`}
            onClick={() => setSelectedSnippet('login')}
          >
            Login Auth Query
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        padding: '10px 14px',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)'
      }}>
        <FileCode size={15} style={{ color: 'var(--accent-cyan)' }} />
        <span style={{ color: 'var(--text-dim)' }}>Target File:</span>
        <strong style={{ color: 'var(--accent-cyan)' }}>{current.file}</strong>
      </div>

      {/* Side-by-side Code Windows */}
      <div className="two-col-grid" style={{ marginBottom: '16px' }}>
        {/* Vulnerable Column */}
        <div className="terminal-card" style={{ borderColor: 'var(--border-danger)' }}>
          <div className="terminal-header" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={15} style={{ color: '#ff6b6b' }} />
              <span style={{ color: '#ff6b6b', fontWeight: 600, fontSize: '12px' }}>
                🔴 VULNERABLE CODE ({current.vulnerableLines})
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              String Concatenation
            </span>
          </div>
          <pre className="terminal-body" style={{ color: '#fca5a5' }}>
            {current.vulnerableCode}
          </pre>
        </div>

        {/* Secure Column */}
        <div className="terminal-card" style={{ borderColor: 'rgba(0, 255, 157, 0.3)' }}>
          <div className="terminal-header" style={{ background: 'rgba(0, 255, 157, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={15} style={{ color: 'var(--accent-green)' }} />
              <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '12px' }}>
                🟢 SECURE CODE ({current.secureLines})
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Parameterized Query
            </span>
          </div>
          <pre className="terminal-body" style={{ color: '#86efac' }}>
            {current.secureCode}
          </pre>
        </div>
      </div>

      {/* Teaching Insight */}
      <div style={{
        padding: '14px 16px',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '4px solid var(--accent-purple)',
        fontSize: '13px',
        lineHeight: '1.6',
        color: 'var(--text-muted)'
      }}>
        <strong style={{ color: 'var(--text-main)' }}>Key Pedagogical Concept: </strong>
        {current.explanation}
      </div>
    </div>
  );
}

