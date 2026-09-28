#!/usr/bin/env bash
# Leállítás. A -v kapcsolóval a szerver adatai (release-ek, adatbázis, naplók) és a kulcsok is törlődnek.
set -euo pipefail
cd "$(dirname "$0")"

if [ "${1:-}" = "-v" ]; then
    docker compose down -v
    rm -rf keys .build
else
    docker compose down
fi
