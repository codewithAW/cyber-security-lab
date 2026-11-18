import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Code2, 
  Lock, 
  FileCode, 
  CheckCircle2, 
  Layers, 
  AlertTriangle,
  BookOpen,
  Cookie,
  KeyRound
} from 'lucide-react';

export function XssLearningDefense() {
  const [selectedTab, setSelectedTab] = useState('code'); // 'code', 'comparison', 'defense-in-depth'

  const vulnerableCode = `// 🚨 VULNERABLE FRONTEND CODE (Interprets untrusted string as raw HTML)
function CommentItem({ comment }) {
  // Directly injecting raw database content into the DOM:
  return (
    <div className="comment-text" 
         dangerouslySetInnerHTML={{ __html: comment.comment }} />
  );
}`;

  const secureCode = `// 🛡️ SECURE FRONTEND CODE (Safe context-aware text interpolation)
function CommentItem({ comment }) {
  // React auto-escapes special HTML characters (<, >, &, ", '):
  return (
    <div className="comment-text">
      {comment.comment}
    </div>
  );
}

// 🛡️ ALTERNATIVE: When rich HTML formatting is genuinely required:
// import DOMPurify from 'dompurify';
// <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.comment) }} />`;

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon green">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="card-title">Educational Defense Center: Preventing Stored XSS</h2>
            <p className="card-desc">
              Understand the technical root causes of XSS, compare XSS with SQL Injection, and inspect defensive implementations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`payload-chip ${selectedTab === 'code' ? 'legit' : ''}`}
            onClick={() => setSelectedTab('code')}
          >
            Code Remediation
          </button>
          <button
            className={`payload-chip ${selectedTab === 'comparison' ? 'legit' : ''}`}
            onClick={() => setSelectedTab('comparison')}
          >
            XSS vs SQL Injection
          </button>
          <button
            className={`payload-chip ${selectedTab === 'defense-in-depth' ? 'legit' : ''}`}
            onClick={() => setSelectedTab('defense-in-depth')}
          >
            Defense-in-Depth
          </button>
        </div>
      </div>

      {selectedTab === 'code' && (
        <div>
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
            <span style={{ color: 'var(--text-dim)' }}>Remediation Location:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>
              cybersecurity-lab/frontend/src/components/CommentSystem.jsx
            </strong>
          </div>

          {/* Side-by-Side Code Windows */}
          <div className="two-col-grid" style={{ marginBottom: '16px' }}>
            {/* Vulnerable */}
            <div className="terminal-card" style={{ borderColor: 'var(--border-danger)' }}>
              <div className="terminal-header" style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={14} style={{ color: '#ff6b6b' }} />
                  <span style={{ color: '#ff6b6b', fontWeight: 600, fontSize: '12px' }}>
                    🔴 VULNERABLE: Direct HTML Injection
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  dangerouslySetInnerHTML
                </span>
              </div>
              <pre className="terminal-body" style={{ color: '#fca5a5' }}>
                {vulnerableCode}
              </pre>
            </div>

            {/* Secure */}
            <div className="terminal-card" style={{ borderColor: 'rgba(0, 255, 157, 0.3)' }}>
              <div className="terminal-header" style={{ background: 'rgba(0, 255, 157, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '12px' }}>
                    🟢 SECURE: Context-Aware Text Interpolation
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Default React JSX Escaping
                </span>
              </div>
              <pre className="terminal-body" style={{ color: '#86efac' }}>
                {secureCode}
              </pre>
            </div>
          </div>

          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-panel)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid var(--accent-green)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: 'var(--text-main)' }}>Why React JSX is Safe by Default: </strong>
            When rendering expressions like <code>&#123;comment.comment&#125;</code>, React converts string values into safe text nodes via DOM <code>textContent</code>. Characters such as <code>&lt;</code> and <code>&gt;</code> are treated as literal characters and never evaluated as executable DOM nodes or script tags.
          </div>
        </div>
      )}

      {selectedTab === 'comparison' && (
        <div>
          <div style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Both SQL Injection and Stored XSS stem from the same fundamental flaw: <strong>mixing untrusted user data with code execution instructions</strong>. However, their execution contexts and impacts are fundamentally distinct:
          </div>

          <div className="data-table-wrapper">
            <table className="taxonomy-table">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Security Attribute</th>
                  <th style={{ width: '45%' }}>Phase 1: SQL Injection (SQLi)</th>
                  <th style={{ width: '45%' }}>Phase 2: Stored Cross-Site Scripting (XSS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Execution Environment</strong></td>
                  <td>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Database Server Engine (MySQL / MariaDB)
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                      Client Browser Engine (V8, JavaScriptCore, Gecko)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Root Cause</strong></td>
                  <td>
                    Concatenating raw user strings into SQL query syntax.
                  </td>
                  <td>
                    Rendering raw user strings as executable HTML/DOM elements.
                  </td>
                </tr>
                <tr>
                  <td><strong>Primary Asset Compromised</strong></td>
                  <td>
                    Confidential database records, tables, and server-side data integrity.
                  </td>
                  <td>
                    Victim's browser session, authentication tokens, cookies, and client actions.
                  </td>
                </tr>
                <tr>
                  <td><strong>Victim Interaction</strong></td>
                  <td>
                    Attacker attacks the backend directly (automated with SQLmap).
                  </td>
                  <td>
                    <strong>Zero-Click for Victim:</strong> Any user viewing the compromised page executes the payload automatically.
                  </td>
                </tr>
                <tr>
                  <td><strong>Core Defense Pattern</strong></td>
                  <td>
                    <strong>Parameterized Queries:</strong> Prepared statements with <code>?</code> placeholders.
                  </td>
                  <td>
                    <strong>Context-Aware Encoding:</strong> Plaintext interpolation (<code>textContent</code>) & HTML sanitization.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'defense-in-depth' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Layer 1: Context-Aware Output Encoding */}
          <div style={{
            background: 'var(--bg-panel)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code2 size={16} style={{ color: 'var(--accent-green)' }} />
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>1. Output Encoding</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              The primary defense. Always encode untrusted data before inserting it into the DOM. React, Angular, and modern templating engines do this automatically unless explicitly bypassed.
            </p>
          </div>

          {/* Layer 2: HTML Sanitization */}
          <div style={{
            background: 'var(--bg-panel)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>2. HTML Sanitization</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              When rich text formatting (bold, italics, links) is required, use a vetted sanitization library like <code>DOMPurify</code> to strip dangerous tags (<code>&lt;script&gt;</code>, <code>onerror</code>).
            </p>
          </div>

          {/* Layer 3: Cookie Hardening (HttpOnly) */}
          <div style={{
            background: 'var(--bg-panel)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cookie size={16} style={{ color: 'var(--accent-amber)' }} />
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>3. HttpOnly Cookie Flag</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Mark sensitive session cookies with the <code>HttpOnly</code> attribute. This prevents JavaScript from accessing <code>document.cookie</code>, blocking session token theft even if XSS occurs!
            </p>
          </div>

          {/* Layer 4: Content Security Policy */}
          <div style={{
            background: 'var(--bg-panel)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <KeyRound size={16} style={{ color: 'var(--accent-purple)' }} />
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>4. Content Security Policy (CSP)</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Set HTTP header: <code>Content-Security-Policy: default-src 'self'; script-src 'self'</code>. Restricts script sources and blocks unauthorized inline scripts and unauthorized external C2 hooks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

