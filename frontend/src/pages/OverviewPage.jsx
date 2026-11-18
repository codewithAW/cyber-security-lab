import React from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Code2, 
  Swords, 
  Database, 
  Server, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Lock
} from 'lucide-react';

export function OverviewPage({ onNavigateToSqlLab, onNavigateToXssLab }) {
  return (
    <div className="page-content">
      {/* Overview Hero */}
      <div className="hero-card">
        <div style={{ maxWidth: '800px' }}>
          <div className="hero-tag">
            <Cpu size={13} />
            <span>PROJECT ARCHITECTURE & LAB ROADMAP</span>
          </div>
          <h1 className="hero-title">Cybersecurity Attack & Defense Lab</h1>
          <p className="hero-subtitle">
            An enterprise-grade educational platform built to teach computer science and cybersecurity students how common application vulnerabilities operate at the binary and protocol levels, and how to implement cryptographic and architectural defenses.
          </p>
        </div>
      </div>

      {/* Lab Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Module 1: SQL Injection */}
        <div className="cyber-card" style={{ borderColor: 'var(--border-accent)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div className="card-icon cyan">
              <Terminal size={20} />
            </div>
            <span className="nav-badge badge-active">PHASE 1 • ACTIVE</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            SQL Injection (SQLi)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Hands-on exploration of tautology attacks, authentication bypasses, UNION queries, and automated testing with Kali Linux SQLmap.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              Ready for Testing
            </span>
            <button 
              className="cyber-btn primary"
              style={{ padding: '6px 14px', fontSize: '12.5px' }}
              onClick={onNavigateToSqlLab}
            >
              <span>Launch Lab</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Module 2: Stored Cross-Site Scripting */}
        <div className="cyber-card" style={{ borderColor: 'rgba(179, 136, 255, 0.4)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div className="card-icon purple">
              <Code2 size={20} />
            </div>
            <span className="nav-badge badge-active" style={{
              background: 'rgba(179, 136, 255, 0.15)',
              color: 'var(--accent-purple)',
              borderColor: 'rgba(179, 136, 255, 0.3)'
            }}>
              PHASE 2 • ACTIVE
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Stored Cross-Site Scripting (XSS)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Demonstrations of persistent database payloads in a live comment feed, safe text rendering defenses, and Kali Linux BeEF browser hooking.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
              Ready for Testing
            </span>
            <button 
              className="cyber-btn primary"
              style={{ 
                padding: '6px 14px', 
                fontSize: '12.5px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
              }}
              onClick={onNavigateToXssLab}
            >
              <span>Launch Lab</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Module 3: Attack & Defense Command Center */}
        <div className="cyber-card disabled-card" style={{ opacity: 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div className="card-icon red">
              <Swords size={20} />
            </div>
            <span className="nav-badge badge-soon">PHASE 3 • COMING SOON</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            SOC Attack & Defense Center
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Real-time attack telemetry, Web Application Firewall (WAF) rule modeling, SIEM log correlation, and incident response orchestration.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={13} />
            <span>Scheduled for Phase 3 Development</span>
          </div>
        </div>
      </div>

      {/* Technical Architecture Overview */}
      <div className="cyber-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon cyan">
              <Server size={18} />
            </div>
            <div>
              <h2 className="card-title">Environment & Security Boundaries</h2>
              <p className="card-desc">
                Architectural guarantees keeping the vulnerable lab safely isolated to local development.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={15} style={{ color: 'var(--accent-green)' }} />
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Strict Loopback Binding</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Express backend binds strictly to <code>127.0.0.1</code>. It does not bind to <code>0.0.0.0</code>, preventing exposure to local networks or Wi-Fi.
            </p>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Database size={15} style={{ color: 'var(--accent-cyan)' }} />
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Principle of Least Privilege</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Application connects using <code>sql_lab_user</code> with only SELECT and INSERT granted on <code>sql_injection_lab</code>. No root access is permitted.
            </p>
          </div>

          <div style={{ background: 'var(--bg-panel)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Terminal size={15} style={{ color: 'var(--accent-purple)' }} />
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Dummy Fictional Data Only</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              All records (admin, student, guest, analyst) are fictional test users created purely for educational instruction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

