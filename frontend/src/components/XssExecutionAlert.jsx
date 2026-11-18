import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Terminal, 
  ShieldAlert, 
  Code,
  Flame
} from 'lucide-react';

export function XssExecutionAlert({ alertData, onDismiss }) {
  if (!alertData) return null;

  return (
    <div className="xss-alert-banner">
      <div style={{
        padding: '8px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(239, 68, 68, 0.25)',
        color: '#ff5252',
        flexShrink: 0
      }}>
        <Flame size={24} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              color: '#ffffff',
              letterSpacing: '0.3px',
              fontFamily: 'var(--font-mono)'
            }}>
              🚨 [STORED XSS DETECTED] CLIENT SCRIPT EXECUTION TRIGGERED
            </span>
            <span className="nav-badge" style={{ background: 'rgba(255, 82, 82, 0.3)', color: '#fff' }}>
              VICTIM SESSION IMPACTED
            </span>
          </div>

          <button 
            onClick={onDismiss}
            className="icon-btn"
            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#fed7d7', lineHeight: '1.5', marginBottom: '10px' }}>
          A malicious payload stored in MySQL was rendered into the DOM by the browser. The JavaScript engine executed the injected attacker payload under the origin's security context!
        </p>

        {/* Payload Display Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 82, 82, 0.35)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#fecaca',
          marginBottom: '8px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          <strong>Executed Payload (Author: {alertData.author}):</strong>
          <div style={{ marginTop: '4px', color: '#00ff9d' }}>{alertData.payload}</div>
        </div>

        <div style={{ fontSize: '11.5px', color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>
          Timestamp: {alertData.timestamp} • Origin: <code>http://localhost:5173</code> • Access to DOM, LocalStorage & Cookies Granted
        </div>
      </div>
    </div>
  );
}

