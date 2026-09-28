#!/usr/bin/env bash
# Belépés a „VPS”-re SSH-val, a deploy felhasználóként (csak kulccsal megy, jelszóval nem).
# Egy parancs is átadható: ./ssh.sh "ls -la /var/www/onemoreslice"
cd "$(dirname "$0")"
source ./ssh-options.sh
exec ssh "${SSH_OPTS[@]}" "$SERVER" "$@"
