#!/usr/bin/env bash
# Rolling deploy: a backend 3 példányát a Swarm egyesével cseréli az új verzióra.
# Használat: ./deploy.sh v2
# (Valódi projektben itt új image-címkét adnánk meg: --image one-more-slice/backend:v2;
#  a bemutatóban ugyanaz az image, csak az APP_VERSION változik, hogy látszódjon a csere.)
set -euo pipefail
cd "$(dirname "$0")"
SERVICE=oms-rolling_backend

VERSION="${1:?Használat: ./deploy.sh <verzió>, pl. ./deploy.sh v2}"
sed -i "s/^APP_VERSION=.*/APP_VERSION=$VERSION/" .env

echo "Rolling update -> $VERSION: egyszerre 1 példány, előbb indul az új, csak utána áll le a régi."
echo
docker service update --detach=false --env-add "APP_VERSION=$VERSION" "$SERVICE"
echo
echo "Kész. A példányok állapota:"
docker service ps "$SERVICE" --filter desired-state=running --format '{{.Name}}  {{.CurrentState}}'
