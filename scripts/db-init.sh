#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/backend/.env"
DB_DIR="$ROOT_DIR/database"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ File .env tidak ditemukan di backend/.env"
  exit 1
fi

# Load env vars
set -a
source "$ENV_FILE"
set +a

if [[ -z "$DB_HOST" || -z "$DB_USER" || -z "$DB_NAME" ]]; then
  echo "❌ Konfigurasi DB belum lengkap di backend/.env"
  exit 1
fi

MYSQL_CMD=(mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USER")
if [[ -n "$DB_PASSWORD" ]]; then
  MYSQL_CMD+=("-p$DB_PASSWORD")
fi

echo "✅ Menyiapkan database: $DB_NAME"

# Create schema (file ini sudah DROP & CREATE database)
"${MYSQL_CMD[@]}" < "$DB_DIR/schema.sql"

# Patch + seed + objek DB
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/patch_add_id_pelanggan_to_user.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/seed.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/functions.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/procedures.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/views.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/triggers.sql"
"${MYSQL_CMD[@]}" "$DB_NAME" < "$DB_DIR/commit_rollback.sql"

echo "✅ Database siap digunakan"
