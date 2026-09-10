# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Étape 1 — build des assets front (Vite)
# ---------------------------------------------------------------------------
FROM node:20-bookworm-slim AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Étape 2 — image applicative PHP
# ---------------------------------------------------------------------------
FROM php:8.3-cli-bookworm AS app

# Extensions PHP nécessaires (MySQL + SQLite, bcmath, zip pour Composer)
RUN apt-get update \
 && apt-get install -y --no-install-recommends libzip-dev libsqlite3-dev unzip git \
 && docker-php-ext-install -j"$(nproc)" pdo_mysql pdo_sqlite bcmath zip \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Code + assets compilés
COPY . .
COPY --from=assets /app/public/build ./public/build

# Fichier d'environnement + dépendances PHP
RUN cp .env.example .env \
 && composer install --no-dev --optimize-autoloader --no-interaction --no-progress \
 && chmod +x docker/entrypoint.sh \
 && chmod -R ug+rw storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
