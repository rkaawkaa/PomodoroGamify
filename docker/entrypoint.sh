#!/usr/bin/env sh
set -e

cd /var/www/html

# 1. Fichier .env
[ -f .env ] || cp .env.example .env

# Reporte dans .env les variables passées par docker-compose (Laravel lit .env
# à chaque requête ; « php artisan serve » ne transmet pas tout l'environnement).
set_env() {
    key="$1"
    val="$2"
    [ -z "$val" ] && return 0
    if grep -qE "^#?[[:space:]]*${key}=" .env; then
        sed -i "s|^#\?[[:space:]]*${key}=.*|${key}=${val}|" .env
    else
        printf '\n%s=%s\n' "$key" "$val" >> .env
    fi
}

DB_FILE="${DB_DATABASE:-/var/www/html/database/database.sqlite}"

set_env APP_NAME       "${APP_NAME}"
set_env APP_ENV        "${APP_ENV}"
set_env APP_DEBUG      "${APP_DEBUG}"
set_env APP_URL        "${APP_URL}"
set_env APP_LOCALE     "${APP_LOCALE}"
set_env DB_CONNECTION  "sqlite"
set_env DB_DATABASE    "${DB_FILE}"
set_env MAIL_MAILER    "${MAIL_MAILER}"

# 2. Clé d'application
php artisan key:generate --force --no-interaction

# 3. Fichier SQLite
mkdir -p "$(dirname "$DB_FILE")"
[ -f "$DB_FILE" ] || touch "$DB_FILE"

# 4. Permissions d'écriture
chmod -R ug+rw storage bootstrap/cache 2>/dev/null || true

# 5. Config non mise en cache, puis schéma
php artisan config:clear
php artisan migrate --force

# 6. Données de démonstration (désactivable avec SEED=false)
if [ "${SEED:-true}" = "true" ]; then
    php artisan db:seed --force
fi

exec "$@"
