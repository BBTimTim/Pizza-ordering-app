#!/bin/bash
# A szerveren futó deploy-lépések (a deploy.sh SSH-n küldi át és futtatja a deploy felhasználóként).
# Paraméterek: $1 = verzió (pl. v2), $2 = release neve (időbélyeg)
set -euo pipefail
VERSION="$1"
RELEASE="$2"
APP=/var/www/onemoreslice
DIR="$APP/releases/$RELEASE"

echo "[szerver] 1/6 Kicsomagolás: releases/$RELEASE"
mkdir -p "$DIR"
tar -xzf /tmp/release.tgz -C "$DIR"
rm -f /tmp/release.tgz

echo "[szerver] 2/6 Közös fájlok bekötése (shared): .env, storage, feltöltött képek"
ln -sfn "$APP/shared/.env" "$DIR/backend/.env"
rm -rf "$DIR/backend/storage" && ln -s "$APP/shared/storage" "$DIR/backend/storage"
rm -rf "$DIR/backend/public/uploads" && ln -s "$APP/shared/uploads" "$DIR/backend/public/uploads"

echo "[szerver] 3/6 Laravel előkészítése az új release-ben (a régi közben zavartalanul fut)"
sed -i "s/^APP_VERSION=.*/APP_VERSION=$VERSION/" "$APP/shared/.env"
cd "$DIR/backend"
php artisan config:cache > /dev/null
php artisan migrate --force
php artisan db:seed --force > /dev/null
chgrp -R www-data bootstrap/cache && chmod -R g+w bootstrap/cache

echo "[szerver] 4/6 Átváltás: a current symlink atomi cseréje"
# Előbb egy ideiglenes symlinket készítünk, majd egyetlen „mv” művelettel lecseréljük a régit.
# A mv atomi: nincs olyan pillanat, amikor a current nem létezik vagy félkész.
ln -sfn "$DIR" "$APP/current.tmp"
mv -Tf "$APP/current.tmp" "$APP/current"

echo "[szerver] 5/6 php-fpm kíméletes újratöltése (a futó kérések befejeződnek, a PHP-gyorsítótár ürül)"
sudo /usr/sbin/service php8.2-fpm reload > /dev/null

echo "[szerver] 6/6 Ellenőrzés és takarítás (az utolsó 5 release marad meg)"
sleep 1
curl -fsS http://127.0.0.1/api/health
echo
ls -1dt "$APP"/releases/* | tail -n +6 | xargs -r rm -rf
echo "[szerver] Aktív release: $(readlink "$APP/current")"
