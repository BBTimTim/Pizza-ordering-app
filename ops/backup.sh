#!/usr/bin/env bash
# Mentés (backup): az adatbázis (mysqldump) és a feltöltött termékképek.
# A mentések a backups/ mappába kerülnek időbélyeggel; a legutóbbi 7 marad meg (rotáció).
# Használat: ./ops/backup.sh
set -euo pipefail
cd "$(dirname "$0")/.."
export MSYS_NO_PATHCONV=1
KEEP=7
STAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p backups

echo "1/3 Adatbázis mentése (mysqldump)..."
# --single-transaction: egy pillanatfelvétel, miközben az oldal zavartalanul működik (nem zárolja a táblákat)
docker compose exec -T db sh -c 'mysqldump --single-transaction --routines --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" 2>/dev/null' \
    | gzip > "backups/db_${STAMP}.sql.gz"
# Ellenőrzés: egy üres vagy hibás mentés ne maradjon meg
if ! gzip -dc "backups/db_${STAMP}.sql.gz" | tail -1 | grep -q "Dump completed"; then
    rm -f "backups/db_${STAMP}.sql.gz"
    echo "HIBA: az adatbázis-mentés nem teljes. Fut a db konténer? (docker compose ps)"
    exit 1
fi

echo "2/3 Feltöltött képek mentése (uploads volume)..."
docker run --rm -v one-more-slice_uploads:/data:ro -v "$(pwd -W 2>/dev/null || pwd)/backups:/backup" \
    alpine tar -czf "/backup/uploads_${STAMP}.tar.gz" -C /data .

echo "3/3 Régi mentések törlése (a legutóbbi $KEEP marad)..."
ls -1t backups/db_*.sql.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
ls -1t backups/uploads_*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

echo
echo "Kész:"
ls -lh "backups/db_${STAMP}.sql.gz" "backups/uploads_${STAMP}.tar.gz" | awk '{print "  " $5 "\t" $9}'
