#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATADIR="$DIR/database/data"
SOCKET="/tmp/mysql.sock"
PORT="3306"

echo "================================================================="
echo "🛡️  STARTING PERSISTENT MARIADB LAB DATABASE"
echo "================================================================="

# 1. Ensure datadir exists and initialized
if [ ! -d "$DATADIR/mysql" ]; then
    echo "[*] Initializing persistent MariaDB data directory..."
    mkdir -p "$DATADIR"
    mariadb-install-db --user="$(whoami)" --datadir="$DATADIR" >/dev/null 2>&1 || true
fi

# 2. Check if already running and responding
if mariadb-admin -S "$SOCKET" ping >/dev/null 2>&1; then
    echo "[✓] MariaDB is already running on socket $SOCKET"
else
    # Try systemd user service first
    if systemctl --user start mariadb-lab 2>/dev/null; then
        echo "[✓] Started MariaDB via user systemd service (mariadb-lab)."
    else
        echo "[*] Starting standalone mariadbd process..."
        nohup /usr/sbin/mariadbd \
            --datadir="$DATADIR" \
            --socket="$SOCKET" \
            --port="$PORT" \
            --pid-file="/tmp/mariadb-lab.pid" > /tmp/mariadb_lab.log 2>&1 &
    fi

    # Wait for socket to become ready
    echo -n "[*] Waiting for MariaDB to be ready..."
    READY=0
    for i in {1..30}; do
        if mariadb-admin -S "$SOCKET" ping >/dev/null 2>&1; then
            echo " READY!"
            READY=1
            break
        fi
        sleep 0.5
        echo -n "."
    done

    if [ "$READY" -ne 1 ]; then
        echo " FAILED."
        echo "❌ Could not establish connection to MariaDB."
        exit 1
    fi
fi

# 3. Ensure database and schema are imported
if ! mariadb -S "$SOCKET" -u "$(whoami)" -e "USE sql_injection_lab;" >/dev/null 2>&1; then
    echo "[*] Applying schema to sql_injection_lab..."
    mariadb -S "$SOCKET" -u "$(whoami)" < "$DIR/database/schema_v2.sql"
    echo "[✓] Schema loaded successfully."
else
    echo "[✓] Database sql_injection_lab is ready."
fi

echo "================================================================="
echo "✅ Database verified and ready for backend!"
echo "================================================================="
