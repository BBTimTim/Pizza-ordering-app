#!/usr/bin/env bash
# Visszaállás az előző release-re: csak a current symlinket állítjuk vissza, és újratöltjük a php-fpm-et.
set -euo pipefail
cd "$(dirname "$0")"
source ./ssh-options.sh

ssh "${SSH_OPTS[@]}" "$SERVER" 'bash -s' <<'EOF'
set -euo pipefail
APP=/var/www/onemoreslice
CURRENT=$(readlink "$APP/current")
PREVIOUS=$(ls -1dt "$APP"/releases/* | grep -v -x "$CURRENT" | head -n 1)
if [ -z "$PREVIOUS" ]; then echo "Nincs korábbi release."; exit 1; fi
ln -sfn "$PREVIOUS" "$APP/current.tmp" && mv -Tf "$APP/current.tmp" "$APP/current"
sudo /usr/sbin/service php8.2-fpm reload > /dev/null
sleep 1
echo "Visszaállva: $(basename "$CURRENT") -> $(basename "$PREVIOUS")"
curl -fsS http://127.0.0.1/api/health; echo
EOF
