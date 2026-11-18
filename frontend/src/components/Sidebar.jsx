import React from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Code2, 
  Swords, 
  Info, 
  Server, 
  Database,
  Lock
} from 'lucide-react';

export function Sidebar({ currentTab, setCurrentTab, systemHealth, onOpenAbout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <ShieldAlert size={22} />
        </div>
        <div>
          <div className="brand-title">CYBER LAB</div>
          <div className="brand-subtitle">ATTACK & DEFENSE</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Laboratories</div>

        <button 
          className={`nav-item ${currentTab === 'sql-injection' ? 'active' : ''}`}
          onClick={() => setCurrentTab('sql-injection')}
        >
          <div className="nav-item-content">
            <Terminal size={17} style={{ color: 'var(--accent-cyan)' }} />
            <span>SQL Injection Lab</span>
          </div>
          <span className="nav-badge badge-active">PHASE 1</span>
        </button>

        <button 
          className={`nav-item ${currentTab === 'xss-lab' ? 'active' : ''}`}
          onClick={() => setCurrentTab('xss-lab')}
        >
          <div className="nav-item-content">
            <Code2 size={17} style={{ color: 'var(--accent-purple)' }} />
            <span>Stored XSS Lab</span>
          </div>
          <span className="nav-badge badge-active" style={{
            background: 'rgba(179, 136, 255, 0.15)',
            color: 'var(--accent-purple)',
            borderColor: 'rgba(179, 136, 255, 0.3)'
          }}>
            PHASE 2
          </span>
        </button>

        <button 
          className="nav-item disabled" 
          disabled
          title="Coming in Phase 3"
        >
          <div className="nav-item-content">
            <Swords size={17} style={{ color: 'var(--text-dim)' }} />
            <span>Attack & Defense</span>
          </div>
          <span className="nav-badge badge-soon">PHASE 3</span>
        </button>

        <div className="nav-section-title" style={{ marginTop: '16px' }}>Documentation</div>

        <button 
          className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
          onClick={() => setCurrentTab('overview')}
        >
          <div className="nav-item-content">
            <Server size={17} style={{ color: 'var(--accent-purple)' }} />
            <span>Lab Overview</span>
          </div>
        </button>

        <button 
          className="nav-item"
          onClick={onOpenAbout}
        >
          <div className="nav-item-content">
            <Info size={17} style={{ color: 'var(--accent-green)' }} />
            <span>About Project</span>
          </div>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="env-badge-card">
          <div className="env-label">
            <Lock size={12} style={{ color: 'var(--accent-green)' }} />
            <span>ENVIRONMENT POSTURE</span>
          </div>
          <div className="env-value">Kali Linux • Localhost</div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            Loopback 127.0.0.1:3001
          </div>
        </div>
      </div>
    </aside>
  );
}

