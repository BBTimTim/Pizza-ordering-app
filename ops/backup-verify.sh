#!/usr/bin/env bash
# Visszaállítási próba: a legutóbbi (vagy megadott) mentést egy KÜLÖN tesztadatbázisba tölti vissza,
# és összeveti a táblák sorainak számát az élő adatbázissal. Az éles adatokat nem érinti.
# „Egy mentés csak akkor ér valamit, ha vissza is lehet állítani belőle.”
# Használat: ./ops/backup-verify.sh [backups/db_....sql.gz]
set -euo pipefail
cd "$(dirname "$0")/.."
FILE="${1:-$(ls -1t backups/db_*.sql.gz 2>/dev/null | head -1)}"
[ -n "$FILE" ] && [ -f "$FILE" ] || { echo "Nincs mentés. Előbb: ./ops/backup.sh"; exit 1; }
TEST_DB=onemoreslice_restore_test

mysql_root() { docker compose exec -T db sh -c "mysql -u root -p\"\$MYSQL_ROOT_PASSWORD\" $* 2>/dev/null"; }

echo "Mentés: $FILE"
echo "1/3 Tesztadatbázis létrehozása: $TEST_DB"
mysql_root -e "'DROP DATABASE IF EXISTS $TEST_DB; CREATE DATABASE $TEST_DB;'"

echo "2/3 Visszatöltés a tesztadatbázisba..."
gzip -dc "$FILE" | mysql_root "$TEST_DB"

echo "3/3 Összevetés (sorok száma táblánként: élő / visszaállított):"
LIVE_DB=$(docker compose exec -T db sh -c 'echo $MYSQL_DATABASE' | tr -d '\r')
OK=1
for table in users products sizes toppings orders order_items; do
    live=$(mysql_root -N -e "'SELECT COUNT(*) FROM $LIVE_DB.$table'" | tr -d '\r')
    restored=$(mysql_root -N -e "'SELECT COUNT(*) FROM $TEST_DB.$table'" | tr -d '\r')
    mark="✔"; [ "$live" = "$restored" ] || { mark="eltér (a mentés óta változhatott)"; OK=0; }
    printf "  %-12s %5s / %-5s %s\n" "$table" "$live" "$restored" "$mark"
done

mysql_root -e "'DROP DATABASE $TEST_DB;'"
echo
if [ "$OK" = 1 ]; then echo "A mentés visszaállítható és teljes. ✔ (a tesztadatbázis törölve)"; else echo "A mentés visszaállítható, de az élő adatok azóta változtak. (a tesztadatbázis törölve)"; fi
