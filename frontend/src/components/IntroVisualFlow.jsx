import React, { useState } from 'react';
import { 
  User, 
  Binary, 
  Database, 
  Send, 
  ChevronRight, 
  AlertTriangle, 
  Info,
  CheckCircle2
} from 'lucide-react';

export function IntroVisualFlow({ defenseMode }) {
  const [activeStep, setActiveStep] = useState(0);
  const isSecure = defenseMode === 'secure';

  const steps = [
    {
      title: "1. User Input",
      sub: "Client Browser / Form",
      icon: User,
      desc: isSecure 
        ? "User submits input data (e.g. username or ID). Input is treated strictly as literal data."
        : "Attacker supplies malicious SQL fragments (e.g., admin' -- or 1 OR 1=1) into user fields.",
      badge: "Step 1"
    },
    {
      title: "2. Backend SQL Query",
      sub: "Express.js Engine",
      icon: Binary,
      desc: isSecure 
        ? "Express prepares the SQL template with ? placeholders and attaches the values in a separate channel."
        : "Express concatenates user input directly into the raw SQL string without sanitization or placeholders.",
      badge: "Step 2"
    },
    {
      title: "3. MySQL Database",
      sub: "MariaDB / MySQL Server",
      icon: Database,
      desc: isSecure 
        ? "MySQL engine compiles the query structure first. Injected quotes cannot escape their data boundary."
        : "MySQL parses the attacker's syntax as actual SQL logic (e.g. bypassing password checks or dumping rows).",
      badge: "Step 3"
    },
    {
      title: "4. Application Response",
      sub: "HTTP Output / UI",
      icon: Send,
      desc: isSecure 
        ? "Application returns only legitimate records intended for the authorized caller."
        : "Application inadvertently leaks unauthorized confidential records or grants unauthorized access.",
      badge: "Step 4"
    }
  ];

  return (
    <div className={`cyber-card ${isSecure ? 'secure-glow' : 'vulnerable-glow'}`}>
      <div className="card-header">
        <div className="card-title-group">
          <div className={`card-icon ${isSecure ? 'green' : 'red'}`}>
            {isSecure ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <h2 className="card-title">SQL Injection Mechanics & Execution Flow</h2>
            <p className="card-desc">
              Understand how untrusted input alters database execution logic versus how parameterized queries neutralize attacks.
            </p>
          </div>
        </div>

        <div className="status-pill" style={{ 
          borderColor: isSecure ? 'rgba(0, 255, 157, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          color: isSecure ? 'var(--accent-green)' : '#ff6b6b' 
        }}>
          {isSecure ? 'Active Defense: Parameterized Queries' : 'Active Vulnerability: Dynamic SQL Injection'}
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="visual-pipeline">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isCurrent = activeStep === idx;
          return (
            <React.Fragment key={idx}>
              <div 
                className={`pipeline-step ${isCurrent ? 'active' : ''} ${!isSecure && isCurrent ? 'vulnerable' : ''}`}
                onClick={() => setActiveStep(idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-node">
                  <Icon size={20} />
                </div>
                <div className="step-title">{s.title}</div>
                <div className="step-sub">{s.sub}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="pipeline-arrow">
                  <ChevronRight size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Interactive Step Description Card */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          background: isSecure ? 'rgba(0, 255, 157, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isSecure ? 'var(--accent-green)' : '#ff6b6b'
        }}>
          <Info size={16} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px' }}>
            {steps[activeStep].title} — <span style={{ color: 'var(--text-muted)' }}>{steps[activeStep].sub}</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {steps[activeStep].desc}
          </div>
        </div>
      </div>
    </div>
  );
}

