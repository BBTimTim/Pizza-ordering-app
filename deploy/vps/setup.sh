#!/usr/bin/env bash
# A „VPS” előkészítése: SSH-kulcs, a szerver elindítása, a termékképek feltöltése.
set -euo pipefail
cd "$(dirname "$0")"

# 1. SSH-kulcspár: a privát kulcs nálunk marad, a nyilvános kerül a szerverre
if [ ! -f keys/id_ed25519 ]; then
    mkdir -p keys
    ssh-keygen -t ed25519 -N "" -C "deploy@one-more-slice" -f keys/id_ed25519 > /dev/null
    echo "SSH-kulcs létrehozva: deploy/vps/keys/id_ed25519 (+ .pub)"
fi

# 2. A szerver felépítése és indítása
docker compose up -d --build --wait

# 3. A demó termékképek egyszeri feltöltése a szerver közös (shared) mappájába
source ./ssh-options.sh
echo "Termékképek feltöltése (scp)..."
scp "${SCP_OPTS[@]}" ../../backend/public/uploads/products/* "deploy@localhost:/var/www/onemoreslice/shared/uploads/products/"

echo
echo "A szerver fut. Belépés: ./ssh.sh   Első telepítés: ./deploy.sh v1   Weboldal: http://localhost:8100"
