-- =============================================================================
-- CYBERSECURITY LABS: SQL INJECTION & XSS DATABASE SCHEMA
-- Target Database: sql_injection_lab
-- =============================================================================

CREATE DATABASE IF NOT EXISTS sql_injection_lab;
USE sql_injection_lab;

-- 1. Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL
);

INSERT INTO users (id, username, password, email, role) VALUES
(1, 'admin', 'waheed', 'waheed@gmail.com', 'admin'),
(2, 'abdul', '12345', 'abdul@gmail.com', 'user'),
(3, 'sarah_j', 'Spring2026!', 'sarah.j@company.io', 'analyst'),
(4, 'm_chang', 'ChangSecure#1', 'm.chang@techcorp.com', 'developer'),
(5, 'emily_w', 'EmilyW#2026', 'emily.watson@enterprise.net', 'manager'),
(6, 'david_m', 'Dav!dM1ller99', 'dmiller@financial.org', 'finance'),
(7, 'jessica_t', 'TaylorSafe77!', 'jess.taylor@domain.com', 'user'),
(8, 'robert_w', 'RobWils0n#pass', 'rwilson@securityhub.io', 'developer'),
(9, 'amanda_m', 'AmandaM@123', 'amanda.m@cloudsys.net', 'user'),
(10, 'james_a', 'JAnderson!88', 'j.anderson@network.org', 'support'),
(11, 'lisa_t', 'LisaT#Pass2026', 'lisa.t@datastack.io', 'marketing'),
(12, 'daniel_j', 'DanJ@ckson44!', 'djackson@corpnet.com', 'analyst'),
(13, 'sophia_w', 'SophiaW#991', 'sophia.w@globaltech.com', 'user'),
(14, 'kevin_h', 'Kev!nHarris12', 'kharris@cybersec.org', 'developer'),
(15, 'olivia_m', 'OliviaM#554', 'olivia.m@apexservices.net', 'user'),
(16, 'brian_c', 'BrianC!pass7', 'bclark@logixcorp.com', 'finance'),
(17, 'rachel_l', 'RachelL#2026!', 'rachel.lewis@innovate.io', 'user');

-- 2. Categories Table
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

INSERT INTO categories (id, name, description) VALUES
(1, 'Glasses', 'Eyewear, smart AR glasses, sunglasses, and tactical frames'),
(2, 'Laptops', 'High-performance workstations, ultraportables, and secure developer notebooks'),
(3, 'Smartphones', 'Flagship 5G phones, encrypted devices, and rugged field smartphones'),
(4, 'Watches', 'Smartwatches, tactical fitness trackers, and precision timepieces'),
(5, 'Accessories', 'Chargers, docks, audio gear, and Faraday privacy protectors');

-- 3. Products Table
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO products (id, category_id, name, price, stock) VALUES
(1, 1, 'Cyber Vision AR Smart Glasses', 299.99, 45),
(2, 1, 'Ray-Pro Aviator Polarized Glasses', 149.50, 80),
(3, 1, 'Blue-Shield Computer Anti-Glare Glasses', 39.99, 150),
(4, 1, 'Stealth HUD Tactical Glasses', 389.00, 25),
(5, 1, 'Wayfarer Matte Classic Glasses', 89.00, 110),
(6, 1, 'Night-Ops Thermal Vision Glasses', 520.00, 12),
(7, 1, 'Titanium Rimless Prescription Frame', 185.00, 65),
(8, 1, 'Cyberpunk Neon LED Glow Glasses', 29.99, 200),
(9, 2, 'CyberBlade 16 Pro Gaming Laptop', 2199.00, 18),
(10, 2, 'UltraSlim Air 14 Aluminum Laptop', 1049.00, 35),
(11, 2, 'DevBook Enterprise Workstation 15', 1750.00, 22),
(12, 2, 'ThinkSec Hardened Linux Laptop', 1420.00, 14),
(13, 2, 'NanoBook 13 Ultraportable', 899.99, 40),
(14, 2, 'Titan 17 Quad-OLED Creator Laptop', 2899.00, 8),
(15, 2, 'EdgeBook 14 Foldable Touch Laptop', 1299.00, 20),
(16, 2, 'Chromebook Enterprise Managed 12', 349.00, 75),
(17, 3, 'Nova 15 Ultra Flagship 5G', 1199.00, 50),
(18, 3, 'SecurPhone Zero Privacy Encrypted Phone', 950.00, 30),
(19, 3, 'PixelEdge 9 AI Smartphone', 849.00, 60),
(20, 3, 'Apex Fold 4 Dual-Screen Phone', 1599.00, 15),
(21, 3, 'CyberPhone CyberDeck Modular', 799.00, 25),
(22, 3, 'Swift 8 Compact 5G', 599.00, 70),
(23, 3, 'Titan Armor Rugged Field Phone', 650.00, 40),
(24, 3, 'Pulse Mini Pocket Smartphone', 399.00, 85),
(25, 4, 'ChronoSync Pro Smartwatch', 349.00, 55),
(26, 4, 'Titanium Diver Automatic 300M', 580.00, 30),
(27, 4, 'Stealth Tactical GPS Matrix Watch', 420.00, 40),
(28, 4, 'Minimalist Sapphire Quartz Watch', 175.00, 90),
(29, 4, 'SolarSport Endurance Ultra Watch', 289.00, 65),
(30, 4, 'Ceramic Skeleton Mechanical Watch', 890.00, 12),
(31, 4, 'Biometric Heart & ECG Smart Band', 99.00, 130),
(32, 4, 'CyberGlow Digital Retro Watch', 45.00, 140),
(33, 5, 'Magnetic Wireless Fast Power Bank 10K', 49.99, 120),
(34, 5, 'Active Noise Cancelling ANC Headphones', 229.00, 45),
(35, 5, 'Mechanical Hot-Swap RGB Keyboard', 139.00, 50),
(36, 5, 'Ergonomic Precision Wireless Mouse', 79.50, 85),
(37, 5, 'Thunderbolt 4 Dual 4K Docking Station', 189.00, 35),
(38, 5, 'Faraday RFID Signal Blocking Pouch', 24.99, 210),
(39, 5, '100W GaN Fast Wall Charger 3-Port', 39.99, 160),
(40, 5, 'High-Speed Braided USB-C Cable 2M', 14.99, 300);

-- 4. Orders Table
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (user_id, total, status) VALUES
(1, 450.00, 'Completed'),
(2, 49.99, 'Shipped'),
(3, 378.99, 'Processing'),
(4, 39.95, 'Delivered');

-- 5. Comments Table for Stored XSS Lab
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (username, comment) VALUES
('Alex (Security Enthusiast)', 'Welcome to the tech community blog! Excited to learn web application security.'),
('Sam (Developer)', 'Great article on secure coding. Remember to always encode output and sanitize user inputs.');

-- 6. Create application user & assign permissions
CREATE USER IF NOT EXISTS 'sql_lab_user'@'localhost' IDENTIFIED BY 'LabSecurePass2026!';
CREATE USER IF NOT EXISTS 'sql_lab_user'@'127.0.0.1' IDENTIFIED BY 'LabSecurePass2026!';
CREATE USER IF NOT EXISTS 'sql_lab_user'@'%' IDENTIFIED BY 'LabSecurePass2026!';

-- Ensure password is set correctly even if user existed previously
ALTER USER 'sql_lab_user'@'localhost' IDENTIFIED BY 'LabSecurePass2026!';
ALTER USER 'sql_lab_user'@'127.0.0.1' IDENTIFIED BY 'LabSecurePass2026!';
ALTER USER 'sql_lab_user'@'%' IDENTIFIED BY 'LabSecurePass2026!';

GRANT ALL PRIVILEGES ON sql_injection_lab.* TO 'sql_lab_user'@'localhost';
GRANT ALL PRIVILEGES ON sql_injection_lab.* TO 'sql_lab_user'@'127.0.0.1';
GRANT ALL PRIVILEGES ON sql_injection_lab.* TO 'sql_lab_user'@'%';

FLUSH PRIVILEGES;

