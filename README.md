# Cybersecurity Practical Labs: SQL Injection & XSS

Two practical, interactive, and locally isolated cybersecurity demonstration labs designed for hands-on instruction in university and college computer science courses.

---

## 🎯 The Two Labs

### Lab 1: SQL Injection Login Demonstration
- **Authentic SaaS Login Page:** Designed as a clean, realistic production login page with:
  - Professional website logo and name.
  - "Welcome Back" heading and "Sign in to your account" subtitle.
  - Email or Username input.
  - Password input with a **Show/Hide password toggle**.
  - "Remember me" checkbox.
  - "Forgot password?" link.
  - Prominent "Sign In" button.
  - "Don't have an account? Sign up" link.
  - Zero hacking clutter: no presets, bypass buttons, raw queries, or technical badges on the login card.
- **Behind-The-Scenes SQL Injection Functionality:**
  - Connects to the local Express backend and MySQL database.
  - Instructors can type demonstration payloads directly (e.g. `admin' -- ` or `' OR '1'='1' -- `).
  - Demonstrates authentication bypass, error handling, and defense modes.
- **Instructor Educational Tray (Collapsible below the form):**
  - Expands on demand during lecture.
  - Shows the real-time executed SQL query string on MySQL.
  - Explains the vulnerability mechanisms (dynamic interpolation vs. parameterized queries).
  - Displays the Kali Linux SQLMap command and reference test credentials.
- **Kali Linux SQLMap Compatibility:**
  - Fully compatible with `sqlmap` against `http://127.0.0.1:3001/api/sqli/login`.
  - Realistic database tables: `users`, `products`, `orders`, `categories`.

---

### Lab 2: Cross-Site Scripting (XSS) Community Blog
- **Landing Page:** Modern community tech blog featuring an article on browser execution boundaries.
- **Vulnerabilities Demonstrated:**
  1. **Stored XSS:** The comment section saves user input directly to MySQL (`comments` table). Malicious payloads (e.g. `<img src=x onerror="alert('Stored XSS Executed!')">`) persist in the database and execute whenever any user opens or refreshes the page.
  2. **Reflected XSS:** Search bar reflects the `?q=` URL parameter into the DOM.
  3. **DOM-Based XSS:** Client-side hashtag sink reads user input and writes directly to `innerHTML`.
  4. **Protected Mode:** Toggle to observe how context-aware output encoding and safe `textContent` interpolation neutralize all three XSS vectors without executing scripts.

---

## 🚀 How to Run Locally

### 1. Database (Persistent MariaDB)
The lab uses an isolated, non-root user service (`mariadb-lab`) that starts automatically on login. You can also start or stop it manually with zero sudo prompts:
```bash
./start-db.sh      # Starts MariaDB and verifies schema & credentials
./stopmaria        # Stops MariaDB
```

### 2. Start the Backend API (Port 3001)
```bash
cd backend
npm install
node server.js
```
- Listens on `http://127.0.0.1:3001` (strictly bound to loopback for security).

### 3. Start the Frontend Dashboard (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
- Open your browser to `http://localhost:5173`.

---

## 🧪 Testing Lab 1 with Kali Linux SQLMap

Run these commands from your Kali Linux terminal against the local lab:

```bash
# 1. Detect SQL Injection on the login endpoint:
sqlmap -u "http://127.0.0.1:3001/api/sqli/login?username=admin&password=123" --batch

# 2. Enumerate databases:
sqlmap -u "http://127.0.0.1:3001/api/sqli/login?username=admin&password=123" --dbs --batch

# 3. Enumerate all tables in sql_injection_lab:
sqlmap -u "http://127.0.0.1:3001/api/sqli/login?username=admin&password=123" -D sql_injection_lab --tables --batch

# 4. Dump records from the products table:
sqlmap -u "http://127.0.0.1:3001/api/sqli/login?username=admin&password=123" -D sql_injection_lab -T products --dump --batch

# 5. Dump records from the orders table:
sqlmap -u "http://127.0.0.1:3001/api/sqli/login?username=admin&password=123" -D sql_injection_lab -T orders --dump --batch
```
