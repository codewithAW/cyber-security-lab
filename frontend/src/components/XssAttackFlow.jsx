import React, { useState, useEffect } from 'react';
import { 
  User, 
  Server, 
  Database, 
  Globe, 
  Code2, 
  Flame, 
  Play, 
  RotateCcw, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function XssAttackFlow({ defenseMode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const isSecure = defenseMode === 'secure';

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    {
      step: 1,
      title: "1. Attacker Injects Payload",
      actor: "Student / Attacker Browser",
      icon: User,
      snippet: `POST /api/comments\n{\n  username: "Attacker",\n  comment: "<img src=x onerror=alert('XSS')>"\n}`,
      desc: "The attacker submits a comment containing HTML and JavaScript event handlers (or <script> tags) instead of regular text."
    },
    {
      step: 2,
      title: "2. Backend Receives Input",
      actor: "Express.js API (Node.js)",
      icon: Server,
      snippet: `router.post('/comments', async (req, res) => {\n  const { comment } = req.body;\n  // Stored without stripping HTML tags\n  await pool.execute(sql, [username, comment]);\n});`,
      desc: "Express receives the request. The application relies on frontend rendering for presentation and preserves the exact text entered by the user."
    },
    {
      step: 3,
      title: "3. MySQL Stores Payload",
      actor: "MariaDB / MySQL Server",
      icon: Database,
      snippet: `INSERT INTO comments (username, comment)\nVALUES ('Attacker', '<img src=x onerror=alert(\\'XSS\\')>');\n-- Persistently stored in database!`,
      desc: "The payload is written to the persistent database table. It is now weaponized and waiting for any user who views the discussion thread."
    },
    {
      step: 4,
      title: "4. Victim Requests Feed",
      actor: "Unsuspecting User / Victim Browser",
      icon: Globe,
      snippet: `GET /api/comments HTTP/1.1\nHost: 127.0.0.1:3001\n\n-- Database returns JSON array of stored comments`,
      desc: "A completely different user (e.g. an administrator or another student) browses to the comments page. The browser requests the comment list from the backend."
    },
    {
      step: 5,
      title: "5. Browser Renders Content",
      actor: "Victim's DOM Engine",
      icon: Code2,
      snippet: isSecure
        ? `// 🛡️ SECURE: Safe text interpolation\n<div>{comment.comment}</div>\n// Output: &lt;img src=x onerror=...&gt; (rendered as text)`
        : `// 🚨 VULNERABLE: Direct HTML injection\n<div dangerouslySetInnerHTML={{ __html: comment.comment }} />\n// Browser parses <img> as an active HTML DOM node!`,
      desc: isSecure
        ? "In Secure Mode, React treats the comment as text, automatically escaping HTML entities. The browser never parses tags as markup."
        : "In Vulnerable Mode, the application renders the comment as raw HTML. The browser parses the <img> tag, fails to load src=x, and prepares to fire the onerror handler!"
    },
    {
      step: 6,
      title: "6. Script Executes in Victim Session",
      actor: "Victim's JavaScript Runtime",
      icon: Flame,
      snippet: isSecure
        ? `// 🛡️ DEFENDED\n// Zero script execution.\n// Payload remains harmless characters on the screen.`
        : `// 🚨 EXPLOITED!\nonerror event handler fires:\nalert('Stored XSS Executed!');\n// Attacker has full access to victim's DOM, cookies & session`,
      desc: isSecure
        ? "Defense Succeeded: The payload was neutralized without executing. The application safely displayed the comment."
        : "Vulnerability Exploited: The JavaScript runs under the victim's authenticated session with full access to their cookies, localStorage, and DOM context!"
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon cyan">
            <Flame size={18} />
          </div>
          <div>
            <h2 className="card-title">Stored XSS Attack Flow & Execution Lifecycle</h2>
            <p className="card-desc">
              Visual walkthrough of how a stored payload travels from submission, to database storage, to victim browser execution.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="cyber-btn primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              if (currentStep >= 6) setCurrentStep(1);
              setIsPlaying(!isPlaying);
            }}
          >
            <Play size={13} />
            <span>{isPlaying ? 'Pause Demo' : 'Run Stored XSS Demonstration'}</span>
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
            <span>Reset Flow</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {steps.map((s) => {
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
                padding: '10px 6px',
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
                  fontSize: '10px', 
                  fontFamily: 'var(--font-mono)', 
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-dim)',
                  fontWeight: 600
                }}>
                  STAGE 0{s.step}
                </span>
                <Icon size={13} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
              </div>
              <div style={{ 
                fontSize: '11px', 
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

      {/* Active Stage Detailed Panel */}
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
              ACTIVE DEMONSTRATION STAGE:
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginTop: '2px' }}>
              {current.title}
            </h3>
          </div>
          <div className="status-pill" style={{ background: 'var(--bg-card)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Executing Entity:</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{current.actor}</span>
          </div>
        </div>

        {/* Code Artifact Box */}
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
            <span>SYSTEM TECHNICAL ARTIFACT:</span>
            <span style={{ color: isSecure ? 'var(--accent-green)' : '#ff6b6b' }}>
              {isSecure ? '🛡️ Defended Mode' : '🚨 Vulnerable Mode'}
            </span>
          </div>
          <pre style={{
            background: 'var(--bg-terminal)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${isSecure ? 'rgba(0, 255, 157, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: isSecure ? '#86efac' : '#fca5a5',
            lineHeight: '1.5',
            overflowX: 'auto'
          }}>
            {current.snippet}
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
          {current.desc}
        </div>
      </div>
    </div>
  );
}

