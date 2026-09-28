#!/usr/bin/env bash
# Leállítás. A -v kapcsolóval az adatbázist és az állapotot is törli (tiszta újrakezdés).
set -euo pipefail
cd "$(dirname "$0")"

if [ "${1:-}" = "-v" ]; then
    docker compose down -v
    rm -f .env router/active/upstream.conf
else
    docker compose down
fi
