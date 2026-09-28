#!/usr/bin/env bash
# Monitoring: összesítő az nginx naplóból (web konténer).
# Megmutatja, hány kérés jött, milyen státuszkóddal, melyek a leggyakoribb és a leglassabb végpontok,
# és voltak-e szerverhibák (5xx). A Docker healthcheck kéréseit kiszűri.
# Használat: ./ops/logs-report.sh [időtartam]   pl. ./ops/logs-report.sh 1h   (alapértelmezés: 24h)
set -euo pipefail
cd "$(dirname "$0")/.."
SINCE="${1:-24h}"

docker compose logs --no-log-prefix --since "$SINCE" web 2>/dev/null | awk -F'"' '
    # Egy sor: IP [idő] "GET /api/products HTTP/1.1" 200 1234 0.015 "böngésző"
    NF >= 5 && $2 ~ /^[A-Z]+ / {
        if ($4 ~ /^Wget/) next                      # a healthcheck kérései (wget) nem érdekesek
        split($2, req, " "); split($3, res, " ")
        path = req[2]; sub(/\?.*/, "", path)          # a lekérdezési paramétereket (?page=2) levágjuk
        status = res[1]; rt = res[3] + 0
        total++; codes[status]++; hits[path]++
        if (status >= 500) errors[path]++
        if (rt > slow_rt[path]) slow_rt[path] = rt
        sum_rt += rt
    }
    END {
        if (total == 0) { print "Nincs kérés a megadott időszakban."; exit }
        printf "Kérések összesen: %d   átlagos válaszidő: %.0f ms\n\n", total, sum_rt / total * 1000
        print "Státuszkódok (2xx = siker, 3xx = átirányítás/gyorsítótár, 4xx = kliens hiba, 5xx = szerverhiba):"
        for (c in codes) printf "  %s  %6d  (%4.1f%%)\n", c, codes[c], codes[c] / total * 100
        print "\nLeggyakoribb végpontok:"
        for (p in hits) printf "  %6d  %s\n", hits[p], p | "sort -rn | head -5"
        close("sort -rn | head -5")
        print "\nLeglassabb végpontok (legnagyobb válaszidő):"
        for (p in slow_rt) printf "  %6.0f ms  %s\n", slow_rt[p] * 1000, p | "sort -rn | head -5"
        close("sort -rn | head -5")
        n = 0; for (p in errors) n++
        if (n == 0) print "\nSzerverhiba (5xx): nem volt ✔"
        else { print "\nSzerverhibák (5xx) – nézd meg: docker compose logs backend"; for (p in errors) printf "  %6d  %s\n", errors[p], p }
    }'
