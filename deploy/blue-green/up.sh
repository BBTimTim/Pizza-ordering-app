#!/usr/bin/env bash
# A blue-green környezet első indítása: adatbázis + kék szín + router. Cím: http://localhost:8090
set -euo pipefail
cd "$(dirname "$0")"

# Az image-eket a fő docker-compose.yml buildeli; ha még nincsenek meg, most elkészülnek
if ! docker image inspect one-more-slice/backend:local one-more-slice/web:local > /dev/null 2>&1; then
    echo "Az image-ek még nem léteznek, buildelés a fő docker-compose.yml-lel..."
    (cd ../.. && docker compose build backend web)
fi

# Állapotfájl: az APP_KEY és a színek verziója (a .gitignore kizárja)
if [ ! -f .env ]; then
    {
        echo "APP_KEY=base64:$(head -c 32 /dev/urandom | base64)"
        echo "BLUE_VERSION=v1"
        echo "GREEN_VERSION=v1"
    } > .env
fi

mkdir -p router/active
[ -f router/active/upstream.conf ] || echo "server blue-web:80;" > router/active/upstream.conf

ACTIVE=$(grep -oE 'blue|green' router/active/upstream.conf)
docker compose up -d --wait db "$ACTIVE-backend" "$ACTIVE-web" router

echo
echo "Fut. Aktív szín: $ACTIVE – http://localhost:8090"
echo "Ellenőrzés: curl http://localhost:8090/api/health"
