#!/usr/bin/env bash
# A rolling környezet indítása Docker Swarmban. Cím: http://localhost:8095
set -euo pipefail
cd "$(dirname "$0")"
STACK=oms-rolling

# Az image-eket a fő docker-compose.yml buildeli
if ! docker image inspect one-more-slice/backend:local one-more-slice/web:local > /dev/null 2>&1; then
    echo "Az image-ek még nem léteznek, buildelés a fő docker-compose.yml-lel..."
    (cd ../.. && docker compose build backend web)
fi

# A Swarm a Docker beépített „fürt” módja. Egy gépen is működik; a ./down.sh --leave kikapcsolja.
if [ "$(docker info --format '{{.Swarm.LocalNodeState}}')" != "active" ]; then
    echo "Docker Swarm bekapcsolása (egygépes fürt)..."
    docker swarm init > /dev/null
fi

# Állapotfájl: APP_KEY és az aktuális verzió (a .gitignore kizárja)
if [ ! -f .env ]; then
    {
        echo "APP_KEY=base64:$(head -c 32 /dev/urandom | base64)"
        echo "APP_VERSION=v1"
    } > .env
fi
set -a; . ./.env; set +a

docker stack deploy --detach=true -c stack.yml "$STACK" > /dev/null

echo "Indulás... (az első indítás 1-2 perc: adatbázis, migráció, 3 backend példány)"
for _ in $(seq 1 90); do
    if curl -s -m 2 http://localhost:8095/api/health | grep -q '"status":"ok"'; then
        echo
        echo "Fut: http://localhost:8095"
        docker service ls --filter "name=${STACK}_"
        exit 0
    fi
    sleep 2
done
echo "HIBA: a környezet nem indult el. Részletek: docker service ps ${STACK}_backend --no-trunc"
exit 1
