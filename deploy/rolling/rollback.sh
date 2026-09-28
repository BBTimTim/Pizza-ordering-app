#!/usr/bin/env bash
# Visszaállás az előző beállításra – ugyanúgy egyesével, leállás nélkül.
set -euo pipefail
cd "$(dirname "$0")"
SERVICE=oms-rolling_backend

docker service rollback --detach=false "$SERVICE"
PREVIOUS=$(docker service inspect "$SERVICE" --format '{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}' | grep '^APP_VERSION=' | cut -d= -f2)
sed -i "s/^APP_VERSION=.*/APP_VERSION=$PREVIOUS/" .env
echo "Visszaállva: $PREVIOUS"
