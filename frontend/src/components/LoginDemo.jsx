import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  Lock, 
  LogIn, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export function LoginDemo({ defenseMode }) {
  const [username, setUsername] = useState("admin' -- ");
  const [password, setPassword] = useState("any_password");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isSecure = defenseMode === 'secure';

  const presets = [
    { label: "Bypass: admin' --", u: "admin' -- ", p: "random_pass", type: "sqli" },
    { label: "Bypass: ' OR '1'='1", u: "' OR '1'='1", p: "' OR '1'='1", type: "sqli" },
    { label: "Legit: admin", u: "admin", p: "SuperSecretAdminPass!", type: "legit" },
    { label: "Legit: student", u: "student", p: "CyberStudent2026#", type: "legit" },
  ];

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password,
          mode: isSecure ? 'secure' : 'vulnerable'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to reach backend at http://127.0.0.1:3001: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cyber-card ${isSecure ? 'secure-glow' : 'vulnerable-glow'}`}>
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon cyan">
            <KeyRound size={18} />
          </div>
          <div>
            <h2 className="card-title">Authentication Portal Demonstration</h2>
            <p className="card-desc">
              Test how SQL Injection bypasses password authentication versus how prepared statements defend against it.
            </p>
          </div>
        </div>

        <span className="nav-badge" style={{
          background: isSecure ? 'rgba(0, 255, 157, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isSecure ? 'var(--accent-green)' : '#ff6b6b',
          border: `1px solid ${isSecure ? 'rgba(0, 255, 157, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          ENDPOINT: POST /api/login
        </span>
      </div>

      <form onSubmit={handleLogin}>
        <div className="two-col-grid" style={{ marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Username Parameter</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input 
                type="text" 
                className="cyber-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or injection payload..."
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password Parameter</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type="text" 
                className="cyber-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
              />
            </div>
          </div>
        </div>

        {/* Quick Payload Preset Chips */}
        <div className="quick-payloads" style={{ marginBottom: '18px' }}>
          <span className="quick-title">
            <Sparkles size={12} />
            <span>Preset Educational Payloads:</span>
          </span>
          <div className="payload-chips">
            {presets.map((p, i) => (
              <button
                type="button"
                key={i}
                className={`payload-chip ${p.type === 'legit' ? 'legit' : ''}`}
                onClick={() => {
                  setUsername(p.u);
                  setPassword(p.p);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            type="submit" 
            className="cyber-btn primary" 
            disabled={loading}
          >
            <LogIn size={15} />
            <span>{loading ? 'Authenticating...' : 'Submit Authentication Request'}</span>
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--border-danger)',
          color: '#ff6b6b',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Results & Status Display */}
      {result && (
        <div className="result-box">
          <div className="result-header" style={{
            background: result.authenticated ? 'rgba(0, 255, 157, 0.08)' : 'rgba(239, 68, 68, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {result.authenticated ? (
                <>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                    AUTHENTICATION GRANTED (Status: 200 OK)
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={16} style={{ color: 'var(--accent-red)' }} />
                  <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                    AUTHENTICATION REJECTED (Status: 401 Unauthorized)
                  </span>
                </>
              )}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
              Execution Latency: {result.executionTimeMs} ms • Mode: {result.mode}
            </div>
          </div>

          <div className="result-content">
            {/* Executed SQL Query Box */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '5px' }}>
                EXECUTED SQL QUERY ON MYSQL:
              </div>
              <div style={{
                background: 'var(--bg-terminal)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                lineHeight: '1.5'
              }}>
                <code>{result.executedQuery}</code>
              </div>
            </div>

            {/* Authenticated User Record Preview */}
            {result.matchedUser ? (
              <div style={{
                padding: '14px',
                background: 'rgba(0, 255, 157, 0.05)',
                border: '1px solid rgba(0, 255, 157, 0.2)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '6px' }}>
                  🔓 LOGGED IN USER RECORD:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>ID: </span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{result.matchedUser.id}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Username: </span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>{result.matchedUser.username}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Role: </span>
                    <span className={`role-badge ${result.matchedUser.role.toLowerCase()}`}>{result.matchedUser.role}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Note: </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{result.matchedUser.note}</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Educational Security Explanation */}
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              padding: '10px 12px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${result.authenticated ? 'var(--accent-green)' : 'var(--accent-red)'}`
            }}>
              {result.authenticated && !isSecure && (
                <div>
                  <strong>🚨 Vulnerability Analysis:</strong> The comment token (<code>-- </code>) told the MySQL parser to ignore the rest of the query (<code>AND password = '...'</code>), allowing login without verifying any password.
                </div>
              )}
              {result.authenticated && isSecure && (
                <div>
                  <strong>✅ Legitimate Authentication:</strong> The provided credentials matched the stored records. Prepared statements ensured that input values did not alter the query syntax.
                </div>
              )}
              {!result.authenticated && isSecure && (
                <div>
                  <strong>🛡️ Defense Active:</strong> The parameter binding mechanism safely escaped the input payload <code>{username}</code> as literal character data. The attack was neutralized!
                </div>
              )}
              {!result.authenticated && !isSecure && (
                <div>
                  <strong>❌ Login Failed:</strong> The user credentials were invalid or the injected SQL logic evaluated to false.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

