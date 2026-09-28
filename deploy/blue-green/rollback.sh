#!/usr/bin/env bash
# Visszaállás: a router visszavált a másik színre (ami a deploy után még fut). Pár ezredmásodperc.
set -euo pipefail
cd "$(dirname "$0")"

ACTIVE=$(grep -oE 'blue|green' router/active/upstream.conf)
if [ "$ACTIVE" = "blue" ]; then PREVIOUS=green; else PREVIOUS=blue; fi

if ! docker compose exec -T router wget -qO- "http://$PREVIOUS-web/api/health" > /dev/null 2>&1; then
    echo "HIBA: a(z) $PREVIOUS szín nem fut vagy nem egészséges, nincs mire visszaállni."
    exit 1
fi

echo "server $PREVIOUS-web:80;" > router/active/upstream.conf
docker compose exec -T router nginx -t -q
docker compose exec -T router nginx -s reload
echo "Visszaállva: $ACTIVE -> $PREVIOUS"
