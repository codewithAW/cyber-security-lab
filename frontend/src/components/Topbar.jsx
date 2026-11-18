import React from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  Sun, 
  Moon, 
  RefreshCw,
  TerminalSquare
} from 'lucide-react';

export function Topbar({ 
  systemHealth, 
  loadingHealth, 
  onRefreshHealth, 
  theme, 
  toggleTheme, 
  defenseMode, 
  toggleDefenseMode 
}) {
  const isOnline = systemHealth?.status === 'online';
  const isDbConnected = systemHealth?.database?.connected;
  const isSecure = defenseMode === 'secure';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="status-pills-group">
          {/* Backend Server Status */}
          <div className="status-pill" title="Express.js API listening strictly on 127.0.0.1:3001">
            <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
            <Server size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Backend: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* MySQL Database Status */}
          <div className="status-pill" title={isDbConnected ? `Connected: ${systemHealth?.database?.version}` : 'Database Disconnected'}>
            <span className={`status-indicator ${isDbConnected ? 'online' : 'offline'}`} />
            <Database size={14} style={{ color: isDbConnected ? 'var(--accent-green)' : 'var(--accent-red)' }} />
            <span>MySQL: {isDbConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>

          {/* Lab Isolation Posture */}
          <div className="status-pill" style={{ borderColor: 'rgba(0, 255, 157, 0.25)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--accent-green)' }}>Loopback 127.0.0.1</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Defense Mode Switcher (Educational toggle for live presentation) */}
        <div className="mode-switch-container" title="Toggle between Vulnerable string concatenation and Secure parameterized queries">
          <button 
            className={`mode-btn ${!isSecure ? 'active-vulnerable' : ''}`}
            onClick={() => isSecure && toggleDefenseMode(false)}
          >
            <ShieldAlert size={13} />
            <span>VULNERABLE</span>
          </button>

          <button 
            className={`mode-btn ${isSecure ? 'active-secure' : ''}`}
            onClick={() => !isSecure && toggleDefenseMode(true)}
          >
            <ShieldCheck size={13} />
            <span>DEFENDED</span>
          </button>
        </div>

        {/* Refresh Status */}
        <button 
          className="icon-btn" 
          onClick={onRefreshHealth} 
          title="Refresh Backend & MySQL Telemetry"
        >
          <RefreshCw size={16} className={loadingHealth ? 'spin' : ''} />
        </button>

        {/* Theme Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

