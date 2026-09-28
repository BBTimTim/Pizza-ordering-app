#!/usr/bin/env bash
# Leállás-figyelő: másodpercenként kb. 5 kérés, soronként az idő, a HTTP kód és a válaszoló verzió.
# Deploy közben egy második terminálban futtatva bizonyítja, hogy nincs kiesés. Leállítás: Ctrl+C
# Használat: ./check-downtime.sh [URL]   (alapértelmezés: blue-green, http://localhost:8090/api/health)
URL="${1:-http://localhost:8090/api/health}"
TOTAL=0
FAILED=0

summary() {
    echo
    echo "Összesen: $TOTAL kérés, sikertelen: $FAILED"
    exit 0
}
trap summary INT TERM

echo "Figyelés: $URL (Ctrl+C a leállításhoz)"
while true; do
    RESPONSE=$(curl -s -m 2 -w ' %{http_code}' "$URL")
    CODE="${RESPONSE##* }"
    VERSION=$(echo "$RESPONSE" | grep -oE '"version":"[^"]*"' | cut -d'"' -f4)
    TOTAL=$((TOTAL + 1))
    if [ "$CODE" != "200" ]; then
        FAILED=$((FAILED + 1))
        echo "$(date +%H:%M:%S)  HIBA ($CODE)"
    else
        echo "$(date +%H:%M:%S)  $CODE  verzió: $VERSION"
    fi
    sleep 0.2
done
