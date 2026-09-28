#!/usr/bin/env bash
# Valódi visszaállítás: az ÉLŐ adatbázist felülírja a megadott mentéssel. Megerősítést kér!
# Használat: ./ops/restore.sh backups/db_20260928_120000.sql.gz [backups/uploads_20260928_120000.tar.gz]
set -euo pipefail
cd "$(dirname "$0")/.."
export MSYS_NO_PATHCONV=1
DB_FILE="${1:?Használat: ./ops/restore.sh backups/db_....sql.gz [backups/uploads_....tar.gz]}"
UPLOADS_FILE="${2:-}"
[ -f "$DB_FILE" ] || { echo "Nincs ilyen fájl: $DB_FILE"; exit 1; }

echo "FIGYELEM: az élő adatbázis tartalma felülíródik ezzel a mentéssel: $DB_FILE"
read -r -p "Biztosan folytatod? Írd be: igen > " ANSWER
[ "$ANSWER" = "igen" ] || { echo "Megszakítva."; exit 0; }

echo "Biztonsági mentés a mostani állapotról, mielőtt felülírjuk..."
./ops/backup.sh > /dev/null

echo "Adatbázis visszaállítása..."
gzip -dc "$DB_FILE" | docker compose exec -T db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" 2>/dev/null'

if [ -n "$UPLOADS_FILE" ]; then
    echo "Képek visszaállítása..."
    docker run --rm -v one-more-slice_uploads:/data -v "$(pwd -W 2>/dev/null || pwd)/backups:/backup:ro" \
        alpine sh -c "tar -xzf /backup/$(basename "$UPLOADS_FILE") -C /data"
fi
echo "Kész. Ellenőrzés: curl http://localhost:8080/api/health"
