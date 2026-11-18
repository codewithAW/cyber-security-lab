import React, { useState, useEffect } from 'react';
import { LabHeader } from './components/LabHeader';
import { SqliLoginLab } from './pages/SqliLoginLab';
import { XssCommunityLab } from './pages/XssCommunityLab';

export function App() {
  const [activeLab, setActiveLab] = useState('sqli'); // 'sqli' or 'xss'
  const [isSecure, setIsSecure] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  // Poll backend health & MySQL status
  const checkHealth = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3001/api/health');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.database);
      } else {
        setDbStatus({ connected: false });
      }
    } catch {
      setDbStatus({ connected: false });
    }
  };

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleDefense = async (enableSecure) => {
    setIsSecure(enableSecure);
    try {
      await fetch('http://127.0.0.1:3001/api/toggle-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lab: activeLab,
          mode: enableSecure ? 'secure' : 'vulnerable'
        })
      });
    } catch (err) {
      console.warn('Defense mode sync failed:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Clean Top Navigation Bar */}
      <LabHeader 
        activeLab={activeLab}
        setActiveLab={setActiveLab}
        isSecure={isSecure}
        onToggleDefense={handleToggleDefense}
        dbStatus={dbStatus}
      />

      {/* Main Practical Lab View */}
      <main style={{ flex: 1 }}>
        {activeLab === 'sqli' ? (
          <SqliLoginLab 
            isSecure={isSecure}
          />
        ) : (
          <XssCommunityLab 
            isSecure={isSecure}
          />
        )}
      </main>
    </div>
  );
}

export default App;
