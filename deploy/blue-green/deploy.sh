#!/usr/bin/env bash
# Blue-green deploy: az új verzió a nem aktív színen indul, ellenőrzés után a router átvált rá.
# Használat: ./deploy.sh v2
set -euo pipefail
cd "$(dirname "$0")"

VERSION="${1:?Használat: ./deploy.sh <verzió>, pl. ./deploy.sh v2}"
ACTIVE=$(grep -oE 'blue|green' router/active/upstream.conf)
if [ "$ACTIVE" = "blue" ]; then TARGET=green; else TARGET=blue; fi
TARGET_VAR="$(echo "$TARGET" | tr '[:lower:]' '[:upper:]')_VERSION"

echo "1/4 Aktív: $ACTIVE. Az új verzió ($VERSION) a(z) $TARGET színen indul, a forgalom addig a(z) $ACTIVE színen marad."
sed -i "s/^$TARGET_VAR=.*/$TARGET_VAR=$VERSION/" .env
docker compose up -d --wait --force-recreate "$TARGET-backend" "$TARGET-web"

echo "2/4 Egészség-ellenőrzés közvetlenül a(z) $TARGET példányon (a felhasználók ezt még nem látják)"
HEALTH=$(docker compose exec -T router wget -qO- "http://$TARGET-web/api/health")
echo "    $HEALTH"
if ! echo "$HEALTH" | grep -q "\"version\":\"$VERSION\""; then
    echo "HIBA: a(z) $TARGET példány nem a várt verziót adja. Nincs átváltás, a(z) $ACTIVE marad aktív."
    exit 1
fi

echo "3/4 Forgalom átváltása: $ACTIVE -> $TARGET (nginx reload, a futó kérések nem szakadnak meg)"
echo "server $TARGET-web:80;" > router/active/upstream.conf
docker compose exec -T router nginx -t -q
docker compose exec -T router nginx -s reload

echo "4/4 Kész: $TARGET aktív ($VERSION). A(z) $ACTIVE szín tovább fut az azonnali visszaálláshoz: ./rollback.sh"
