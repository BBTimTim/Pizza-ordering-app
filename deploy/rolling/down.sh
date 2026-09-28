#!/usr/bin/env bash
# Leállítás.
#   ./down.sh          – a stack leállítása (az adatbázis megmarad)
#   ./down.sh -v       – az adatbázis és az állapot törlése is
#   ./down.sh --leave  – ezen felül a Docker Swarm kikapcsolása is
set -euo pipefail
cd "$(dirname "$0")"
STACK=oms-rolling

docker stack rm "$STACK" > /dev/null 2>&1 || true
echo "A stack leáll..."
# A Swarm a hálózatokat és konténereket a háttérben takarítja; megvárjuk
for _ in $(seq 1 30); do
    [ -z "$(docker ps -q --filter "label=com.docker.stack.namespace=$STACK")" ] && break
    sleep 2
done

if [ "${1:-}" = "-v" ] || [ "${1:-}" = "--leave" ]; then
    docker volume rm "${STACK}_db-data" "${STACK}_uploads" > /dev/null 2>&1 || true
    rm -f .env
fi
if [ "${1:-}" = "--leave" ]; then
    docker swarm leave --force > /dev/null
    echo "Docker Swarm kikapcsolva."
fi
echo "Leállítva."
