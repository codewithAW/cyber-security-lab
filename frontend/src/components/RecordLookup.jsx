import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  Terminal, 
  Sparkles, 
  FileText, 
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Code
} from 'lucide-react';

export function RecordLookup({ defenseMode }) {
  const [recordId, setRecordId] = useState("1 OR 1=1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewFormat, setViewFormat] = useState('table'); // 'table' or 'json'

  const isSecure = defenseMode === 'secure';

  const presets = [
    { label: "Normal Record (1)", val: "1", type: "normal" },
    { label: "Normal Record (2)", val: "2", type: "normal" },
    { label: "Tautology: 1 OR 1=1", val: "1 OR 1=1", type: "sqli" },
    { label: "Always True: 1' OR '1'='1", val: "1' OR '1'='1", type: "sqli" },
    { label: "UNION Injection", val: "1 UNION SELECT 99, 'injected_admin', 'Exploited', 'Extracted via UNION' -- ", type: "sqli" }
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const modeParam = isSecure ? '&mode=secure' : '';
      const response = await fetch(
        `http://127.0.0.1:3001/api/users/search?id=${encodeURIComponent(recordId)}${modeParam}`
      );
      const data = await response.json();
      
      if (!response.ok && !data.executedQuery) {
        throw new Error(data.error || 'Server error');
      }
      setResult(data);
    } catch (err) {
      setError(`Backend query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cyber-card ${isSecure ? 'secure-glow' : 'vulnerable-glow'}`}>
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon purple">
            <Search size={18} />
          </div>
          <div>
            <h2 className="card-title">Database Record Lookup (Interactive SQLi Target)</h2>
            <p className="card-desc">
              Query records from the <code>users</code> table by Record ID. Notice how injected clauses alter query semantics.
            </p>
          </div>
        </div>

        <span className="nav-badge" style={{
          background: 'rgba(179, 136, 255, 0.15)',
          color: 'var(--accent-purple)',
          border: '1px solid rgba(179, 136, 255, 0.3)'
        }}>
          ENDPOINT: GET /api/users/search?id=...
        </span>
      </div>

      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label className="form-label">Record Identifier Parameter (id)</label>
          <div className="input-wrapper">
            <Database size={16} className="input-icon" />
            <input 
              type="text" 
              className="cyber-input" 
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="e.g. 1 or 1 OR 1=1"
              required
            />
          </div>
        </div>

        {/* Quick Payload Preset Chips */}
        <div className="quick-payloads" style={{ marginBottom: '18px' }}>
          <span className="quick-title">
            <Sparkles size={12} />
            <span>Click to Load Educational Payloads:</span>
          </span>
          <div className="payload-chips">
            {presets.map((p, i) => (
              <button
                type="button"
                key={i}
                className={`payload-chip ${p.type === 'normal' ? 'legit' : ''}`}
                onClick={() => setRecordId(p.val)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            type="submit" 
            className="cyber-btn primary" 
            disabled={loading}
          >
            <Search size={15} />
            <span>{loading ? 'Executing Query...' : 'Execute Database Search'}</span>
          </button>
        </div>
      </form>

      {/* Network or Error Banner */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--border-danger)',
          color: '#ff6b6b',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Live Results Panel */}
      {result && (
        <div className="result-box">
          <div className="result-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: result.success ? 'var(--accent-green)' : 'var(--accent-red)',
                fontWeight: 600
              }}>
                {result.success ? `QUERY SUCCESS (${result.recordsFound || 0} Records Returned)` : 'SQL SYNTAX ERROR'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  type="button"
                  className={`payload-chip ${viewFormat === 'table' ? 'legit' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() => setViewFormat('table')}
                >
                  Table View
                </button>
                <button 
                  type="button"
                  className={`payload-chip ${viewFormat === 'json' ? 'legit' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                  onClick={() => setViewFormat('json')}
                >
                  Raw JSON
                </button>
              </div>

              <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                Latency: {result.executionTimeMs || 0} ms
              </span>
            </div>
          </div>

          <div className="result-content">
            {/* Executed Query Box */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '5px' }}>
                EXECUTED SQL QUERY STRING:
              </div>
              <div style={{
                background: 'var(--bg-terminal)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                lineHeight: '1.5'
              }}>
                <code>{result.executedQuery}</code>
              </div>
            </div>

            {/* Error Message if SQL Error */}
            {result.error && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid var(--border-danger)',
                borderRadius: 'var(--radius-sm)',
                color: '#ff6b6b',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                marginBottom: '16px'
              }}>
                <strong>MySQL Error:</strong> {result.sqlMessage || result.error}
              </div>
            )}

            {/* Data Display: Table or JSON */}
            {result.data && result.data.length > 0 ? (
              viewFormat === 'table' ? (
                <div className="data-table-wrapper">
                  <table className="cyber-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Note / Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((row, index) => (
                        <tr key={index}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.id}</td>
                          <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{row.username}</td>
                          <td>
                            <span className={`role-badge ${String(row.role).toLowerCase()}`}>
                              {row.role}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre style={{
                  background: 'var(--bg-terminal)',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--accent-green)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  overflowX: 'auto',
                  maxHeight: '260px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )
            ) : (
              !result.error && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                  No records matched the criteria.
                </div>
              )
            )}

            {/* Educational takeaway */}
            <div style={{
              marginTop: '16px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              padding: '10px 14px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${result.recordsFound > 1 ? 'var(--accent-red)' : 'var(--accent-cyan)'}`
            }}>
              {result.recordsFound > 1 && !isSecure && (
                <div>
                  <strong>🚨 Data Exfiltration Alert:</strong> The injected <code>1 OR 1=1</code> clause transformed the SQL condition to always evaluate to TRUE. As a result, MySQL returned <strong>all {result.recordsFound} user records</strong> instead of a single ID!
                </div>
              )}
              {result.recordsFound === 1 && (
                <div>
                  <strong>ℹ️ Target Found:</strong> Exactly 1 record retrieved. {isSecure ? 'Parameterized binding ensured the condition stayed isolated.' : 'Clean integer query.'}
                </div>
              )}
              {isSecure && (
                <div style={{ marginTop: '4px', color: 'var(--accent-green)' }}>
                  <strong>🛡️ Secure Verification:</strong> Under parameterized defense, input <code>{recordId}</code> was treated strictly as a single parameter value.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

