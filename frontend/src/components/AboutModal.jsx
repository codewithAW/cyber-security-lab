import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Terminal, 
  Database, 
  Server, 
  Lock, 
  GraduationCap, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="card-icon cyan" style={{ width: '32px', height: '32px' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                About Cybersecurity Attack & Defense Lab
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                UNIFIED PHASES 1 & 2: SQL INJECTION & STORED XSS
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} style={{ color: 'var(--accent-cyan)' }} />
              Educational Objectives
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              This platform was engineered for hands-on cybersecurity instruction in universities and technical colleges. It provides students with a genuine, functional laboratory to observe the root causes of SQL Injection and Stored XSS, execute authorized penetration testing with Kali Linux's SQLmap and BeEF, and verify modern software defense patterns.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                DEFENSE PATTERNS
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-green)' }}>
                Parameterized Queries & Safe Encoding
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Prepared statements for SQL, and context-aware auto-escaping for HTML/DOM rendering.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                LEAST PRIVILEGE
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                Restricted MySQL Account
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Application operates via sql_lab_user with SELECT, INSERT, DELETE privileges only.
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '8px' }}>
              Laboratory Architecture
            </h4>
            <ul style={{ 
              fontSize: '12.5px', 
              color: 'var(--text-muted)', 
              lineHeight: '1.8',
              paddingLeft: '18px'
            }}>
              <li><strong>Frontend:</strong> React, Vite, Lucide React, Modern SOC CSS (Port 5173).</li>
              <li><strong>Backend:</strong> Node.js, Express.js, mysql2 promise pool (Strict Loopback 127.0.0.1:3001).</li>
              <li><strong>Database:</strong> MariaDB / MySQL with schema <code>sql_injection_lab</code> (<code>users</code> and <code>comments</code> tables).</li>
              <li><strong>Offensive Security Tooling:</strong> SQLmap & BeEF running from Kali Linux terminal against isolated targets.</li>
            </ul>
          </div>

          <div style={{
            padding: '12px 16px',
            background: 'rgba(0, 255, 157, 0.08)',
            border: '1px solid rgba(0, 255, 157, 0.25)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Phase 1 Ready:</strong> Real MySQL backend integration, genuine responses, verified SQLmap targets, and no ORM or mock APIs.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--bg-secondary)'
        }}>
          <button className="cyber-btn primary" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}

