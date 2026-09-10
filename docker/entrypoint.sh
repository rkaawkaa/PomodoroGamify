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

set_env APP_NAME       "${APP_NAME}"
set_env APP_ENV        "${APP_ENV}"
set_env APP_DEBUG      "${APP_DEBUG}"
set_env APP_URL        "${APP_URL}"
set_env APP_LOCALE     "${APP_LOCALE}"
set_env DB_CONNECTION  "${DB_CONNECTION}"
set_env DB_HOST        "${DB_HOST}"
set_env DB_PORT        "${DB_PORT}"
set_env DB_DATABASE    "${DB_DATABASE}"
set_env DB_USERNAME    "${DB_USERNAME}"
set_env DB_PASSWORD    "${DB_PASSWORD}"
set_env MAIL_MAILER    "${MAIL_MAILER}"
set_env MAIL_HOST      "${MAIL_HOST}"
set_env MAIL_PORT      "${MAIL_PORT}"

# 2. Clé d'application
php artisan key:generate --force --no-interaction

# 3. Attendre que MySQL réponde (double sécurité en plus du depends_on)
if [ "${DB_CONNECTION}" = "mysql" ]; then
    echo "En attente de la base de données..."
    i=0
    until php -r '
        try {
            new PDO("mysql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT"), getenv("DB_USERNAME"), getenv("DB_PASSWORD"));
        } catch (Throwable $e) { exit(1); }
        exit(0);
    ' 2>/dev/null; do
        i=$((i + 1))
        [ "$i" -ge 60 ] && echo "Base de données injoignable, on abandonne." && exit 1
        sleep 2
    done
    echo "Base de données prête."
fi

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
