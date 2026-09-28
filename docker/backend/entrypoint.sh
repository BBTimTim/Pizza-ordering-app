#!/bin/sh
set -e

# Ha nincs megadva APP_KEY, egyszer generálunk egyet, és a storage volume-ban megőrizzük
KEY_FILE=storage/app/.app_key
if [ -z "$APP_KEY" ]; then
    if [ ! -f "$KEY_FILE" ]; then
        echo "base64:$(head -c 32 /dev/urandom | base64)" > "$KEY_FILE"
    fi
    export APP_KEY="$(cat "$KEY_FILE")"
fi

php artisan config:cache
php artisan migrate --force
php artisan db:seed --force

chown -R www-data:www-data storage bootstrap/cache public/uploads

exec "$@"
