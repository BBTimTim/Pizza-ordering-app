#!/usr/bin/env bash
# Zero-downtime deploy egy „VPS”-re SSH-n keresztül.
# 1) Itt helyben elkészül a telepítőcsomag (build artifact) a már buildelt Docker image-ekből
# 2) scp-vel feltöltjük a szerverre
# 3) ssh-n lefuttatjuk a szerveren a server/release.sh lépéseit
# Használat: ./deploy.sh v2
set -euo pipefail
cd "$(dirname "$0")"
source ./ssh-options.sh
export MSYS_NO_PATHCONV=1   # Git Bash: ne alakítsa át a konténeren belüli útvonalakat

VERSION="${1:?Használat: ./deploy.sh <verzió>, pl. ./deploy.sh v2}"
RELEASE=$(date +%Y%m%d%H%M%S)

echo "[helyi] 1/3 Telepítőcsomag készítése (backend + React build) a Docker image-ekből"
rm -rf .build && mkdir -p .build/backend .build/frontend
docker create --name oms-artifact-backend one-more-slice/backend:local > /dev/null
docker cp oms-artifact-backend:/var/www/html/. .build/backend
docker rm oms-artifact-backend > /dev/null
docker create --name oms-artifact-web one-more-slice/web:local > /dev/null
docker cp oms-artifact-web:/usr/share/nginx/html/. .build/frontend
docker rm oms-artifact-web > /dev/null
# A feltöltött képek és a storage nem kerülnek a csomagba: ezek a szerver shared/ mappájában vannak
tar -czf .build/release.tgz -C .build --exclude=backend/public/uploads --exclude=backend/storage backend frontend
echo "        csomag: $(du -h .build/release.tgz | cut -f1)"

echo "[helyi] 2/3 Feltöltés a szerverre (scp)"
scp "${SCP_OPTS[@]}" .build/release.tgz "$SERVER:/tmp/release.tgz"
rm -rf .build

echo "[helyi] 3/3 Telepítés a szerveren (ssh)"
ssh "${SSH_OPTS[@]}" "$SERVER" "bash -s -- $VERSION $RELEASE" < server/release.sh
