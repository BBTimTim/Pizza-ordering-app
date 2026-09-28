# syntax=docker/dockerfile:1

# 1. szakasz – közös alap: PHP-FPM a szükséges bővítményekkel
FROM php:8.2-fpm-alpine AS base
RUN docker-php-ext-install pdo_mysql opcache
COPY docker/backend/php.ini /usr/local/etc/php/conf.d/zz-app.ini
WORKDIR /var/www/html

# 2. szakasz – függőségek telepítése Composerrel (a Composer nem kerül a végső image-be)
FROM base AS vendor
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY backend/ ./
RUN composer dump-autoload --optimize --no-dev

# 3. szakasz – futtatható image: csak a kód és a vendor mappa
FROM base AS runtime
COPY --from=vendor /var/www/html /var/www/html
COPY docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh \
    && chown -R www-data:www-data storage bootstrap/cache public/uploads
EXPOSE 9000
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
