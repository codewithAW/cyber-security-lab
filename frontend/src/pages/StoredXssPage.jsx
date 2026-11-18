import React, { useState } from 'react';
import { XssIntroSection } from '../components/XssIntroSection';
import { CommentSystem } from '../components/CommentSystem';
import { XssAttackFlow } from '../components/XssAttackFlow';
import { BeefDemonstration } from '../components/BeefDemonstration';
import { XssLearningDefense } from '../components/XssLearningDefense';
import { XssExecutionAlert } from '../components/XssExecutionAlert';

export function StoredXssPage({ defenseMode }) {
  const [activeAlert, setActiveAlert] = useState(null);

  const handleTriggerAlert = (alertDetails) => {
    setActiveAlert(alertDetails);
  };

  return (
    <div className="page-content">
      {/* Active Educational Alert if payload executes in vulnerable mode */}
      <XssExecutionAlert 
        alertData={activeAlert}
        onDismiss={() => setActiveAlert(null)}
      />

      {/* Section A: XSS Introduction & Taxonomy Comparison */}
      <XssIntroSection defenseMode={defenseMode} />

      {/* Section B & C: Interactive Persistent Comment System */}
      <CommentSystem 
        defenseMode={defenseMode}
        onTriggerXssAlert={handleTriggerAlert}
      />

      {/* Section D: 6-Step Visual Lifecycle & Demonstration Walkthrough */}
      <XssAttackFlow defenseMode={defenseMode} />

      {/* Section E: Kali Linux BeEF Integration & Hooking Panel */}
      <BeefDemonstration />

      {/* Section F: Student Learning & Defense Principles */}
      <XssLearningDefense />
    </div>
  );
}

