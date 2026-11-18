import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  UserCheck, 
  Lock,
  Layers
} from 'lucide-react';

export function DatabaseTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.error || 'Failed to load records');
      }
    } catch (err) {
      setError(`Failed to fetch database records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon green">
            <Database size={18} />
          </div>
          <div>
            <h2 className="card-title">Database Records Reference (MySQL Table: `users`)</h2>
            <p className="card-desc">
              Live dummy records currently stored in MySQL database <code>sql_injection_lab</code>.
            </p>
          </div>
        </div>

        <button 
          className="cyber-btn secondary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          <span>Refresh Table</span>
        </button>
      </div>

      {error ? (
        <div style={{
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
      ) : (
        <div className="data-table-wrapper">
          <table className="cyber-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Description / Note</th>
                <th>Security Clearance</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    #{u.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {u.username}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                    {u.note}
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      fontFamily: 'var(--font-mono)',
                      color: u.role === 'Administrator' ? 'var(--accent-red)' : 'var(--accent-green)'
                    }}>
                      {u.role === 'Administrator' ? 'RESTRICTED (Level 5)' : 'STANDARD (Level 1)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Database Security Architecture Footer */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={14} style={{ color: 'var(--accent-green)' }} />
          <span>Restricted Database User: <strong>sql_lab_user</strong> (SELECT, INSERT only)</span>
        </div>
        <div style={{ color: 'var(--accent-cyan)' }}>
          DB: sql_injection_lab • TABLE: users
        </div>
      </div>
    </div>
  );
}

