import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Code
} from 'lucide-react';

export function CommentSystem({ defenseMode, onTriggerXssAlert }) {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('Attacker (Demonstration)');
  const [commentText, setCommentText] = useState("<img src=\"invalid_link.png\" onerror=\"alert('Stored XSS Executed!')\">");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Instructor Reset State
  const [instructorKey, setInstructorKey] = useState('kali_instructor_2026');
  const [showResetModal, setShowResetModal] = useState(false);

  const isSecure = defenseMode === 'secure';
  const executedPayloadsRef = useRef(new Set());

  // Preset Educational Payloads
  const presets = [
    {
      label: "Image OnError (Instant Trigger)",
      u: "Attacker (Demonstration)",
      payload: `<img src="invalid_link.png" onerror="alert('Stored XSS Executed via <img> onerror!')">`,
      type: "xss"
    },
    {
      label: "Classic Script Tag",
      u: "Attacker (Demonstration)",
      payload: `<script>alert('Stored XSS Executed via <script> tag!')</script>`,
      type: "xss"
    },
    {
      label: "SVG OnLoad Payload",
      u: "Attacker (Demonstration)",
      payload: `<svg onload="alert('Stored XSS Executed via <svg> onload!')">`,
      type: "xss"
    },
    {
      label: "Cookie Stealer Simulation",
      u: "Attacker (Demonstration)",
      payload: `<script>alert('Simulated Session Steal: document.cookie=' + (document.cookie || 'session_token=lab_auth_token_999'));</script>`,
      type: "xss"
    },
    {
      label: "Legitimate Feedback",
      u: "Alice (Security Analyst)",
      payload: `Completed security audit on API endpoints. All tests passed successfully.`,
      type: "legit"
    }
  ];

  // Fetch comments from backend
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/comments');
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        // If in vulnerable mode, check if any comments contain active payloads
        if (!isSecure) {
          checkAndExecuteVulnerablePayloads(data.comments);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch comments');
      }
    } catch (err) {
      setError(`Failed to reach backend at http://127.0.0.1:3001: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [defenseMode]);

  // Handle educational execution detection in Vulnerable Mode
  const checkAndExecuteVulnerablePayloads = (commentList) => {
    commentList.forEach((c) => {
      const text = c.comment;
      const isXssCandidate = /<script\b[^>]*>([\s\S]*?)<\/script>/i.test(text) ||
                             /<(img|svg|body|iframe)[^>]+on\w+\s*=/i.test(text);

      if (isXssCandidate && !executedPayloadsRef.current.has(c.id)) {
        executedPayloadsRef.current.add(c.id);

        // Notify parent to show educational execution banner / toast
        if (onTriggerXssAlert) {
          onTriggerXssAlert({
            id: c.id,
            author: c.username,
            payload: c.comment,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }
    });
  };

  // Submit comment to backend
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('http://127.0.0.1:3001/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() || 'Anonymous Student',
          comment: commentText
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Comment saved and stored in MySQL database.');
        // Clear or keep comment text
        fetchComments();
      } else {
        throw new Error(data.error || 'Failed to submit comment');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Instructor Reset
  const handleReset = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/comments', {
        method: 'DELETE',
        headers: {
          'x-instructor-key': instructorKey
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        executedPayloadsRef.current.clear();
        setSuccessMsg('Instructor reset complete: Database comments restored to clean defaults.');
        setShowResetModal(false);
        fetchComments();
      } else {
        throw new Error(data.error || 'Reset failed');
      }
    } catch (err) {
      setError(`Instructor reset failed: ${err.message}`);
    }
  };

  return (
    <div className={`cyber-card ${isSecure ? 'secure-glow' : 'vulnerable-glow'}`}>
      <div className="card-header">
        <div className="card-title-group">
          <div className={`card-icon ${isSecure ? 'green' : 'purple'}`}>
            <MessageSquare size={18} />
          </div>
          <div>
            <h2 className="card-title">Interactive Persistent Comment System</h2>
            <p className="card-desc">
              Demonstrates Stored XSS lifecycle: input saved in MySQL and rendered to all visiting users.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="cyber-btn secondary"
            style={{ padding: '6px 12px', fontSize: '11.5px' }}
            onClick={fetchComments}
            disabled={loading}
            title="Refresh comments from MySQL"
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh Feed</span>
          </button>

          <button 
            className="cyber-btn danger"
            style={{ padding: '6px 12px', fontSize: '11.5px' }}
            onClick={() => setShowResetModal(true)}
            title="Instructor reset operation"
          >
            <Trash2 size={13} />
            <span>Instructor Reset</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Submission Form Left, Comments Feed Right */}
      <div className="two-col-grid" style={{ marginBottom: '16px' }}>
        {/* Left Column: Comment Submission Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Commenter Identity (Username)</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input 
                  type="text"
                  className="cyber-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name or alias..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Comment Message / Payload Content</label>
              <textarea 
                className="cyber-input"
                style={{ minHeight: '110px', resize: 'vertical', paddingTop: '10px' }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter comment or demonstration XSS payload..."
                required
              />
            </div>

            {/* Clickable Preset Educational Chips */}
            <div className="quick-payloads" style={{ marginBottom: '16px' }}>
              <span className="quick-title">
                <Sparkles size={12} />
                <span>Preset Demonstration Payloads:</span>
              </span>
              <div className="payload-chips">
                {presets.map((p, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`payload-chip ${p.type === 'legit' ? 'legit' : ''}`}
                    onClick={() => {
                      setUsername(p.u);
                      setCommentText(p.payload);
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                type="submit"
                className="cyber-btn primary"
                disabled={submitting}
              >
                <Send size={14} />
                <span>{submitting ? 'Persisting to MySQL...' : 'Submit & Store Comment'}</span>
              </button>
            </div>
          </form>

          {/* Success / Error notification */}
          {successMsg && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid rgba(0, 255, 157, 0.25)',
              color: 'var(--accent-green)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)'
            }}>
              ✅ {successMsg}
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--border-danger)',
              color: '#ff6b6b',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)'
            }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Right Column: Persistent Stored Comments Feed */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '10px',
            paddingBottom: '6px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              STORED COMMENTS ({comments.length} Persisted in DB)
            </span>
            <span style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)',
              color: isSecure ? 'var(--accent-green)' : 'var(--accent-red)'
            }}>
              {isSecure ? '🛡️ Safe Text Rendering' : '🚨 Unsafe HTML Rendering'}
            </span>
          </div>

          <div className="comment-list">
            {comments.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                No comments currently in database. Submit one on the left!
              </div>
            ) : (
              comments.map((c) => {
                const hasScriptTag = /<script\b[^>]*>|<(img|svg|iframe)\b[^>]*on/i.test(c.comment);

                return (
                  <div 
                    key={c.id} 
                    className={`comment-card ${!isSecure && hasScriptTag ? 'vulnerable-content' : isSecure ? 'secure-content' : ''}`}
                  >
                    <div className="comment-header">
                      <div className="comment-author-group">
                        <div className="comment-avatar">
                          {c.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="comment-author-name">{c.username}</div>
                          <div className="comment-timestamp">
                            ID #{c.id} • {new Date(c.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {hasScriptTag && (
                        <span className="nav-badge" style={{
                          background: isSecure ? 'rgba(0, 255, 157, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isSecure ? 'var(--accent-green)' : '#ff6b6b',
                          border: `1px solid ${isSecure ? 'rgba(0, 255, 157, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {isSecure ? 'NEUTRALIZED' : 'XSS PAYLOAD'}
                        </span>
                      )}
                    </div>

                    {/* Comment Body Rendering */}
                    {isSecure ? (
                      /* SECURE MODE: Default React JSX Text Interpolation (Context-aware escaping) */
                      <div className="comment-body safe-text-rendered" title="Safely encoded as literal text">
                        {c.comment}
                      </div>
                    ) : (
                      /* VULNERABLE MODE: Interprets raw user string as executable HTML */
                      <div>
                        <div 
                          className="comment-body raw-html-rendered"
                          dangerouslySetInnerHTML={{ __html: c.comment }}
                          title="Interpreted directly as raw HTML / DOM markup"
                        />
                        {hasScriptTag && (
                          <div style={{
                            marginTop: '6px',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: '#ff6b6b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertTriangle size={12} />
                            <span>Unsafe HTML element interpreted into browser DOM!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Instructor Reset Modal */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 14, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-danger)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="card-icon red">
                <Trash2 size={18} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Instructor Database Reset Control
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              This operation deletes all injected demonstration comments from the MySQL <code>comments</code> table and restores the clean baseline records.
            </p>

            <div className="form-group">
              <label className="form-label">Instructor Access Authorization Key</label>
              <div className="input-wrapper">
                <Lock size={15} className="input-icon" />
                <input 
                  type="text"
                  className="cyber-input"
                  value={instructorKey}
                  onChange={(e) => setInstructorKey(e.target.value)}
                  placeholder="Enter instructor key..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="cyber-btn secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="cyber-btn danger"
                onClick={handleReset}
              >
                Confirm Database Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

