import React from 'react';
import { 
  Code2, 
  Database, 
  Server, 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  AlertTriangle,
  Globe,
  Cpu
} from 'lucide-react';

export function XssIntroSection({ defenseMode }) {
  const isSecure = defenseMode === 'secure';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-grid">
          <div>
            <div className="hero-tag" style={{ borderColor: 'rgba(179, 136, 255, 0.3)', color: 'var(--accent-purple)' }}>
              <Code2 size={13} />
              <span>PHASE 2: STORED CROSS-SITE SCRIPTING LAB</span>
            </div>
            <h1 className="hero-title">Stored XSS Lab</h1>
            <p className="hero-subtitle">
              Learn how untrusted user input saved in databases can execute as arbitrary client-side JavaScript in victims' browsers, and how developers enforce context-aware encoding and sanitization.
            </p>
          </div>

          <div className="hero-telemetry-panel">
            {/* Telemetry 1: MySQL Storage */}
            <div className="telemetry-item">
              <div className="telemetry-label">
                <Database size={13} style={{ color: 'var(--accent-green)' }} />
                <span>Persistence Store</span>
              </div>
              <div className="telemetry-value" style={{ color: 'var(--accent-green)' }}>
                MySQL: `comments`
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                Persistent in Database
              </div>
            </div>

            {/* Telemetry 2: Backend API */}
            <div className="telemetry-item">
              <div className="telemetry-label">
                <Server size={13} style={{ color: 'var(--accent-cyan)' }} />
                <span>Express API</span>
              </div>
              <div className="telemetry-value" style={{ color: 'var(--accent-cyan)' }}>
                /api/comments
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                GET • POST • DELETE
              </div>
            </div>

            {/* Telemetry 3: Attack Vector */}
            <div className="telemetry-item">
              <div className="telemetry-label">
                <AlertTriangle size={13} style={{ color: 'var(--accent-amber)' }} />
                <span>XSS Classification</span>
              </div>
              <div className="telemetry-value" style={{ color: 'var(--accent-amber)' }}>
                Type I: Stored
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                Zero-Click Victim Impact
              </div>
            </div>

            {/* Telemetry 4: Rendering Engine */}
            <div className="telemetry-item">
              <div className="telemetry-label">
                {isSecure ? (
                  <ShieldCheck size={13} style={{ color: 'var(--accent-green)' }} />
                ) : (
                  <ShieldAlert size={13} style={{ color: 'var(--accent-red)' }} />
                )}
                <span>Rendering Mode</span>
              </div>
              <div className="telemetry-value" style={{ color: isSecure ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {isSecure ? 'Safe Plaintext' : 'Unsafe HTML'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {isSecure ? 'Context-Aware Escaped' : 'Raw DOM Injection'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* XSS Taxonomy & Comparison Matrix Card */}
      <div className="cyber-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon purple">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="card-title">Cross-Site Scripting Taxonomy: Stored vs Reflected vs DOM</h2>
              <p className="card-desc">
                Understand how different types of XSS vulnerabilities originate, propagate, and impact user sessions.
              </p>
            </div>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="taxonomy-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>XSS Type</th>
                <th>Storage Location</th>
                <th>Payload Delivery Mechanism</th>
                <th>Victim Requirement</th>
                <th>Severity Level</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                <td>
                  <strong style={{ color: '#ff6b6b' }}>Stored XSS (Type I)</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    (Lab Focus)
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                    Server Database / Filesystem
                  </span>
                </td>
                <td>
                  Injected permanently into database (e.g. comments, profiles, forums). Server renders stored payload to any visitor.
                </td>
                <td>
                  <strong>Zero-Click:</strong> Victim merely browses the legitimate page.
                </td>
                <td>
                  <span className="role-badge admin">CRITICAL</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: 'var(--accent-cyan)' }}>Reflected XSS (Type II)</strong>
                </td>
                <td>
                  <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    None (Non-persistent)
                  </span>
                </td>
                <td>
                  Payload is in the HTTP request (URL query parameters or forms) and reflected immediately in the server response.
                </td>
                <td>
                  Victim must be tricked into clicking a phishing or crafted link.
                </td>
                <td>
                  <span className="role-badge analyst">HIGH</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: 'var(--accent-purple)' }}>DOM-based XSS (Type 0)</strong>
                </td>
                <td>
                  <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    Client-side DOM
                  </span>
                </td>
                <td>
                  Vulnerability exists entirely in client JavaScript (e.g. <code>location.hash</code> passed into <code>eval()</code> or <code>innerHTML</code>).
                </td>
                <td>
                  Client-side script reads unvalidated input directly from the browser DOM.
                </td>
                <td>
                  <span className="role-badge student">HIGH</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

