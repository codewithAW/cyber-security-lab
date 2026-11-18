import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Code2, 
  Layers
} from 'lucide-react';

export function LabHeader({ activeLab, setActiveLab, isSecure, onToggleDefense }) {
  return (
    <header className="app-header">
      {/* Brand */}
      <div className="brand-badge">
        <div className="brand-icon-box">
          <Layers size={18} />
        </div>
        <span>CYBER LABS</span>
      </div>

      {/* The 2 Navigation Buttons */}
      <div className="nav-tabs-group">
        <button 
          className={`nav-tab-btn ${activeLab === 'sqli' ? 'active' : ''}`}
          onClick={() => setActiveLab('sqli')}
        >
          <Lock size={15} />
          <span>SQL Injection</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeLab === 'xss' ? 'active' : ''}`}
          onClick={() => setActiveLab('xss')}
        >
          <Code2 size={15} />
          <span>Cross-Site Scripting</span>
        </button>
      </div>

      {/* Defense Mode Switcher */}
      <div className="defense-switch" title="Toggle between Vulnerable and Secure modes">
        <button 
          type="button"
          className={`switch-btn ${!isSecure ? 'active-vuln' : ''}`}
          onClick={() => isSecure && onToggleDefense(false)}
        >
          <ShieldAlert size={12} />
          <span>VULNERABLE</span>
        </button>

        <button 
          type="button"
          className={`switch-btn ${isSecure ? 'active-sec' : ''}`}
          onClick={() => !isSecure && onToggleDefense(true)}
        >
          <ShieldCheck size={12} />
          <span>SECURE</span>
        </button>
      </div>
    </header>
  );
}
