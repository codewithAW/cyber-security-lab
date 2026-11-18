import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { IntroVisualFlow } from '../components/IntroVisualFlow';
import { LoginDemo } from '../components/LoginDemo';
import { RecordLookup } from '../components/RecordLookup';
import { SqlmapTerminal } from '../components/SqlmapTerminal';
import { AttackFlowVisualization } from '../components/AttackFlowVisualization';
import { DatabaseTable } from '../components/DatabaseTable';
import { CodeComparison } from '../components/CodeComparison';

export function SqlInjectionPage({ systemHealth, defenseMode }) {
  return (
    <div className="page-content">
      {/* Section A: Hero Section */}
      <HeroSection 
        systemHealth={systemHealth} 
        defenseMode={defenseMode} 
      />

      {/* Section B: SQL Injection Introduction & Flow */}
      <IntroVisualFlow 
        defenseMode={defenseMode} 
      />

      {/* Two Column Grid: Section C & Section D */}
      <div className="two-col-grid">
        {/* Section C: Login Demonstration */}
        <LoginDemo 
          defenseMode={defenseMode} 
        />

        {/* Section D: Database Record Lookup */}
        <RecordLookup 
          defenseMode={defenseMode} 
        />
      </div>

      {/* Section F: Attack Flow Visualization */}
      <AttackFlowVisualization 
        defenseMode={defenseMode} 
      />

      {/* Section E: SQLmap Kali Linux Command Center */}
      <SqlmapTerminal />

      {/* Section G: Database Dummy Records Reference */}
      <DatabaseTable />

      {/* Section H: Attack & Defense Teaching Code Comparison */}
      <CodeComparison />
    </div>
  );
}

