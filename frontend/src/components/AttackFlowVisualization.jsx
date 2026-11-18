import React, { useState, useEffect } from 'react';
import { 
  User, 
  Server, 
  Code2, 
  Database, 
  Send, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export function AttackFlowVisualization({ defenseMode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const isSecure = defenseMode === 'secure';

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const flowSteps = [
    {
      step: 1,
      title: "1. User Submits Input",
      actor: "Client Browser / Kali Terminal",
      icon: User,
      vulnerableSnippet: `Payload: admin' -- `,
      secureSnippet: `Payload: admin' -- `,
      explanation: isSecure 
        ? "The user sends input. Regardless of special characters (quotes, dashes), the client simply delivers a string value over HTTP."
        : "The attacker intentionally enters SQL control characters (e.g. quote ' and SQL comment syntax --) designed to break syntax boundaries."
    },
    {
      step: 2,
      title: "2. Express Receives Request",
      actor: "Node.js Express Server",
      icon: Server,
      vulnerableSnippet: `const { username } = req.body; // Unsanitized string`,
      secureSnippet: `const { username } = req.body; // Kept as isolated parameter`,
      explanation: isSecure
        ? "Express extracts the username parameter and prepares to bind it as a separate parameter token."
        : "Express takes the raw string directly from the request object and prepares to concatenate it into a query."
    },
    {
      step: 3,
      title: "3. SQL Query Construction",
      actor: "Application Logic",
      icon: Code2,
      vulnerableSnippet: `// 🚨 Raw string interpolation!\nconst sql = \`SELECT * FROM users WHERE username = '\${username}'\`;\n// Becomes: SELECT * FROM users WHERE username = 'admin' -- '`,
      secureSnippet: `// 🛡️ Prepared statement with placeholder\nconst sql = "SELECT * FROM users WHERE username = ?";\n// Values passed separately in array: [username]`,
      explanation: isSecure
        ? "Prepared statement definition: The SQL structure is established before any user input is evaluated. The '?' acts as a strict placeholder for data only."
        : "Dynamic string concatenation joins user input into the code stream. The attacker's quote closes the string literal early, and the double dash comments out remaining syntax!"
    },
    {
      step: 4,
      title: "4. MySQL Processes Query",
      actor: "MariaDB / MySQL Engine",
      icon: Database,
      vulnerableSnippet: `EXECUTE PARSED QUERY:\nSELECT * FROM users WHERE username = 'admin' /* password check dropped! */`,
      secureSnippet: `PRE-COMPILED QUERY EXECUTION:\nQuery template compiled once. Injected payload treated purely as a 10-char string.`,
      explanation: isSecure
        ? "MySQL does not compile the input. It checks if any username literally matches the string \"admin' -- \". No match found; authentication safely fails."
        : "MySQL parser sees the comment syntax and truncates execution of the password check. The condition evaluates true for the admin account without password verification!"
    },
    {
      step: 5,
      title: "5. Application Returns Response",
      actor: "HTTP Response Output",
      icon: Send,
      vulnerableSnippet: `HTTP/1.1 200 OK\n{ authenticated: true, user: "admin", role: "Administrator" }`,
      secureSnippet: `HTTP/1.1 401 Unauthorized\n{ authenticated: false, message: "Invalid credentials." }`,
      explanation: isSecure
        ? "Defense complete: The application denies unauthorized access and logs the failed attempt safely."
        : "Exploitation complete: The attacker gains unauthorized administrator access without knowing the secret password."
    }
  ];

  const current = flowSteps[currentStep - 1];

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon cyan">
            <Code2 size={18} />
          </div>
          <div>
            <h2 className="card-title">End-to-End Attack & Defense Visual Flow</h2>
            <p className="card-desc">
              Step-by-step breakdown of how user input traverses from browser to MySQL execution engine.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="cyber-btn secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              if (currentStep >= 5) setCurrentStep(1);
              setIsPlaying(!isPlaying);
            }}
          >
            <Play size={13} />
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button 
            className="cyber-btn secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {flowSteps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <button
              key={s.step}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(s.step);
              }}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(179, 136, 255, 0.15))'
                  : 'var(--bg-panel)',
                border: `1px solid ${isActive ? 'var(--border-accent)' : isPassed ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '10px 8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontFamily: 'var(--font-mono)', 
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-dim)',
                  fontWeight: 600
                }}>
                  STEP 0{s.step}
                </span>
                <Icon size={14} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
              </div>
              <div style={{ 
                fontSize: '11.5px', 
                fontWeight: 600, 
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {s.title.split('. ')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown Panel */}
      <div style={{
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--accent-cyan)', 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 600 
            }}>
              ACTIVE STEP:
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginTop: '2px' }}>
              {current.title}
            </h3>
          </div>
          <div className="status-pill" style={{ background: 'var(--bg-card)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Subsystem:</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{current.actor}</span>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)'
          }}>
            <span>SYSTEM EXECUTION CODE ARTIFACT:</span>
            <span style={{ color: isSecure ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {isSecure ? '🛡️ Parameterized Pipeline' : '🚨 Vulnerable Interpolation'}
            </span>
          </div>
          <pre style={{
            background: 'var(--bg-terminal)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${isSecure ? 'rgba(0, 255, 157, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            color: isSecure ? '#86efac' : '#fca5a5',
            lineHeight: '1.5',
            overflowX: 'auto'
          }}>
            {isSecure ? current.secureSnippet : current.vulnerableSnippet}
          </pre>
        </div>

        {/* Narrative Description */}
        <div style={{
          padding: '14px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: `4px solid ${isSecure ? 'var(--accent-green)' : 'var(--accent-red)'}`,
          fontSize: '13px',
          color: 'var(--text-main)',
          lineHeight: '1.6'
        }}>
          {current.explanation}
        </div>
      </div>
    </div>
  );
}

