-- =============================================================================
-- CYBERSECURITY ATTACK & DEFENSE LAB — PHASE 2 MIGRATION
-- Target Database: sql_injection_lab (Existing)
-- Adds: comments table for Stored XSS demonstration
-- =============================================================================

USE sql_injection_lab;

-- 1. Create the comments table if not exists
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Populate with initial fictional comments if table is empty
INSERT INTO comments (username, comment)
SELECT 'Alice (Security Analyst)', 'Welcome to the Cybersecurity Lab comment feed! Feel free to leave a note or feedback.'
WHERE NOT EXISTS (SELECT 1 FROM comments WHERE username = 'Alice (Security Analyst)');

INSERT INTO comments (username, comment)
SELECT 'Bob (DevOps)', 'System update complete. Remember to always apply context-aware encoding and sanitization.'
WHERE NOT EXISTS (SELECT 1 FROM comments WHERE username = 'Bob (DevOps)');


-- 3. Grant DELETE permissions to sql_lab_user for instructor reset operation
GRANT SELECT, INSERT, DELETE ON sql_injection_lab.* TO 'sql_lab_user'@'localhost';
GRANT SELECT, INSERT, DELETE ON sql_injection_lab.* TO 'sql_lab_user'@'127.0.0.1';

FLUSH PRIVILEGES;

