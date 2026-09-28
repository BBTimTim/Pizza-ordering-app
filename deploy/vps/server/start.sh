#!/bin/bash
# A „szerver” indulása: adatbázis, könyvtárszerkezet, jogosultságok, szolgáltatások.
# Valódi VPS-en ezt a systemd csinálná; a konténerben ez a script helyettesíti.
set -e
APP=/var/www/onemoreslice

# 1. Adatbázis (MariaDB) – első induláskor létrehozzuk az adatbázist és a felhasználót
service mariadb start
if [ ! -d /var/lib/mysql/onemoreslice ]; then
    mysql -e "CREATE DATABASE onemoreslice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
              CREATE USER 'onemoreslice'@'localhost' IDENTIFIED BY 'secret';
              GRANT ALL PRIVILEGES ON onemoreslice.* TO 'onemoreslice'@'localhost';
              FLUSH PRIVILEGES;"
fi

# 2. Könyvtárszerkezet:
#    releases/ – minden deploy egy új, időbélyeges mappa
#    shared/   – ami minden release-ben közös: .env, storage (naplók, cache), feltöltött képek
#    current   – symlink az éppen futó release-re
mkdir -p "$APP/releases" "$APP/shared/uploads/products" \
         "$APP/shared/storage/app" "$APP/shared/storage/logs" \
         "$APP/shared/storage/framework/cache/data" "$APP/shared/storage/framework/sessions" "$APP/shared/storage/framework/views"

if [ ! -f "$APP/shared/.env" ]; then
    cat > "$APP/shared/.env" <<EOF
APP_NAME="One more slice"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:$(head -c 32 /dev/urandom | base64)
APP_URL=http://localhost:8100
FRONTEND_URL=http://localhost:8100
APP_VERSION=v0
LOG_CHANNEL=single
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=onemoreslice
DB_USERNAME=onemoreslice
DB_PASSWORD=secret
EOF
fi

# 3. Jogosultságok: a fájlok a deploy felhasználóé; a php-fpm (www-data csoport) csak oda írhat, ahova kell
chown -R deploy:deploy "$APP"
chgrp -R www-data "$APP/shared/storage" "$APP/shared/uploads"
chmod -R g+rwX "$APP/shared/storage" "$APP/shared/uploads"
find "$APP/shared/storage" "$APP/shared/uploads" -type d -exec chmod g+s {} +   # az új fájlok is www-data csoportba kerülnek
chmod 640 "$APP/shared/.env" && chgrp www-data "$APP/shared/.env"             # a titkokat más nem olvashatja

# 4. SSH-kulcs: a nyilvános kulcsot a deploy felhasználó authorized_keys fájljába tesszük (szigorú jogokkal)
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
install -m 600 -o deploy -g deploy /keys/id_ed25519.pub /home/deploy/.ssh/authorized_keys

# 5. Szolgáltatások
service php8.2-fpm start
service nginx start
mkdir -p /run/sshd
exec /usr/sbin/sshd -D -e
