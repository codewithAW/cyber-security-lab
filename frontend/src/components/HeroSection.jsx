import React from 'react';
import { 
  Database, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Terminal
} from 'lucide-react';

export function HeroSection({ systemHealth, defenseMode }) {
  const isOnline = systemHealth?.status === 'online';
  const db = systemHealth?.database;
  const isSecure = defenseMode === 'secure';

  return (
    <section className="hero-card">
      <div className="hero-grid">
        <div>
          <div className="hero-tag">
            <Terminal size={13} />
            <span>PHASE 1: WEB VULNERABILITY LAB</span>
          </div>
          <h1 className="hero-title">SQL Injection Lab</h1>
          <p className="hero-subtitle">
            Explore how unsafe database queries can expose application data and learn how developers defend against SQL injection.
          </p>
        </div>

        <div className="hero-telemetry-panel">
          {/* Telemetry 1: MySQL Database */}
          <div className="telemetry-item">
            <div className="telemetry-label">
              <Database size={13} style={{ color: db?.connected ? 'var(--accent-green)' : 'var(--accent-red)' }} />
              <span>MySQL Engine</span>
            </div>
            <div className="telemetry-value" style={{ color: db?.connected ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {db?.connected ? 'Online (Active)' : 'Disconnected'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {db?.database || 'sql_injection_lab'}
            </div>
          </div>

          {/* Telemetry 2: Backend Server */}
          <div className="telemetry-item">
            <div className="telemetry-label">
              <Server size={13} style={{ color: isOnline ? 'var(--accent-cyan)' : 'var(--accent-red)' }} />
              <span>Express Backend</span>
            </div>
            <div className="telemetry-value" style={{ color: isOnline ? 'var(--accent-cyan)' : 'var(--accent-red)' }}>
              {isOnline ? '127.0.0.1:3001' : 'Offline'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              Node.js v24 • REST API
            </div>
          </div>

          {/* Telemetry 3: Environment Isolation */}
          <div className="telemetry-item">
            <div className="telemetry-label">
              <Cpu size={13} style={{ color: 'var(--accent-purple)' }} />
              <span>Lab Environment</span>
            </div>
            <div className="telemetry-value" style={{ color: 'var(--accent-purple)' }}>
              Kali Linux
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              Localhost Loopback
            </div>
          </div>

          {/* Telemetry 4: Active Query Mode */}
          <div className="telemetry-item">
            <div className="telemetry-label">
              {isSecure ? (
                <ShieldCheck size={13} style={{ color: 'var(--accent-green)' }} />
              ) : (
                <ShieldAlert size={13} style={{ color: 'var(--accent-red)' }} />
              )}
              <span>Query Execution</span>
            </div>
            <div className="telemetry-value" style={{ color: isSecure ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {isSecure ? 'Parameterized' : 'Vulnerable'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {isSecure ? 'Prepared Statements' : 'Raw Concatenation'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

