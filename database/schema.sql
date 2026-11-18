-- =============================================================================
-- CYBERSECURITY ATTACK & DEFENSE LAB — UNIFIED DATABASE SCHEMA
-- Target Database: sql_injection_lab
-- Purpose: Educational demonstration of SQL Injection (Phase 1) & Stored XSS (Phase 2)
-- =============================================================================

-- 1. Create the isolated lab database
CREATE DATABASE IF NOT EXISTS sql_injection_lab;
USE sql_injection_lab;

-- 2. Phase 1: Users table for SQL Injection demonstrations
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    note VARCHAR(255) NOT NULL
);

-- 3. Insert fictional test records for Phase 1
INSERT INTO users (username, password, role, note) VALUES
('admin', 'SuperSecretAdminPass!', 'Administrator', 'Primary root admin account. Confidential clearance.'),
('student', 'CyberStudent2026#', 'Student', 'Cybersecurity lab student with basic lab access.'),
('guest', 'GuestUser123', 'Guest', 'Temporary guest visitor account with restricted viewing.'),
('analyst', 'SecAnalyst99!', 'Security Analyst', 'SOC Level 2 analyst monitoring incident telemetry.');

-- 4. Phase 2: Comments table for Stored XSS demonstrations
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert fictional sample comments for Phase 2
INSERT INTO comments (username, comment) VALUES
('Alice (Security Analyst)', 'Welcome to the Cybersecurity Lab comment feed! Feel free to leave a note or feedback.'),
('Bob (DevOps)', 'System update complete. Remember to always apply context-aware encoding and sanitization.');

-- 6. Principle of Least Privilege: Create a restricted application user
-- Granted SELECT, INSERT, DELETE on sql_injection_lab.* (no root access, no DROP DATABASE)
CREATE USER IF NOT EXISTS 'sql_lab_user'@'localhost' IDENTIFIED BY 'LabSecurePass2026!';
CREATE USER IF NOT EXISTS 'sql_lab_user'@'127.0.0.1' IDENTIFIED BY 'LabSecurePass2026!';

GRANT SELECT, INSERT, DELETE ON sql_injection_lab.* TO 'sql_lab_user'@'localhost';
GRANT SELECT, INSERT, DELETE ON sql_injection_lab.* TO 'sql_lab_user'@'127.0.0.1';

FLUSH PRIVILEGES;
