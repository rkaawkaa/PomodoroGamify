# PomoBloom

Application web de minuteur Pomodoro avec suivi de l'activité et système de
progression. Réalisée avec Laravel 12, Inertia.js et React (TypeScript).

Une documentation technique détaillée (architecture, base de données, routes,
système de points) est disponible dans [`DOCUMENTATION.md`](DOCUMENTATION.md).

## Fonctionnalités principales

- Minuteur focus / pause avec durées configurables et démarrage automatique
  optionnel
- Enregistrement des sessions terminées ; déclaration manuelle de sessions
  passées
- Projets et catégories rattachables aux sessions
- Objectifs quotidiens et mensuels
- Système de points et 20 niveaux (avatar évolutif)
- Page de statistiques : indicateurs, graphiques 14 jours / 8 semaines,
  historique paginé, classement
- Mur de messages « La Flamme » avec likes
- Récapitulatifs hebdomadaires / mensuels / annuels par e-mail (opt-in)
- Interface disponible en 6 langues (fr, en, es, it, pt, de)
- Minuteur utilisable sans compte (réglages et tâches en `localStorage`)
- Thème clair / sombre et plusieurs jeux de couleurs

## Stack

| Couche | Techno |
|--------|--------|
| Back | Laravel 12 (PHP 8.3) |
| Front | React 18 + TypeScript, via Inertia.js v2 |
| Build | Vite |
| CSS | Tailwind CSS |
| Base de données | SQLite (dev) / MySQL (prod) |
| Auth | Laravel Breeze |
| E-mails | Resend |
| Tests | Pest |

## Démarrage rapide avec Docker

C'est la voie la plus simple : seul **Docker** est requis. L'image build le
front, applique les migrations et joue le seeder automatiquement au démarrage.

```bash
docker compose up --build
```

Puis ouvrir **http://localhost:8000** et se connecter avec
`marc@example.com` / `password`.

- Un seul conteneur, base **SQLite** persistée dans un volume Docker (`db-data`).
- E-mails écrits dans les logs (`MAIL_MAILER=log`), aucune clé d'API requise.
- `SEED: "false"` dans `docker-compose.yml` pour ne plus rejouer le seeder à
  chaque redémarrage ; `docker compose down -v` supprime aussi la base.

## Installation manuelle (sans Docker)

Prérequis sur la machine :

- **PHP 8.3+** avec les extensions habituelles de Laravel
  (`pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `curl`,
  `fileinfo`, `bcmath`) — distribution type Laragon, XAMPP, Herd ou PHP système
- **Composer 2**
- **Node.js 20+** et **npm**
- Aucun serveur de base de données (SQLite = simple fichier) ni serveur mail
  (driver `log` par défaut)

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate        # crée database/database.sqlite + les tables
php artisan db:seed        # jeu de données de démo (voir plus bas)

composer run dev           # serveur PHP + worker + logs + Vite, sur :8000
```

Pour lancer les services séparément : `php artisan serve` et `npm run dev`.

## Données de démonstration et compte de test

Le seeder `DemoSeeder` crée **6 comptes** (mot de passe commun : `password`),
chacun avec des projets, des catégories récemment créées, des tâches (en cours et
terminées), un historique de sessions Pomodoro réparti sur le dernier mois, des
objectifs, des messages de victoire et l'historique de points correspondant.

```bash
# Peupler la base
php artisan db:seed

# Ou tout remettre à zéro puis peupler
php artisan migrate:fresh --seed
```

Se connecter ensuite sur http://localhost:8000/login avec :

| E-mail | Mot de passe | Note |
|--------|--------------|------|
| `marc@example.com` | `password` | compte principal, gros historique, **onboarding non fait** (le carrousel s'affiche à la connexion) |

Autres comptes (onboarding déjà fait, même mot de passe) : `claire@example.com`,
`sofiane@example.com`, `emma@example.com`, `lucas@example.com`, `nadia@example.com`.

## Inspecter la base de données

Fichier SQLite : `database/database.sqlite` (installation manuelle) ou volume
Docker `db-data` (`/data/database.sqlite` dans le conteneur).

Sans rien installer, via Artisan :

```bash
php artisan db:show                   # liste des tables + nombre de lignes
php artisan db:table users            # colonnes, index et clés d'une table
php artisan db:table pomodoro_sessions
php artisan db                        # ouvre un shell SQL interactif
php artisan tinker                    # console : \App\Models\User::with('projects')->get()
```

En Docker, préfixer par `docker compose exec app` :

```bash
docker compose exec app php artisan db:show
docker compose exec app php artisan db:table users
# ou extraire le fichier pour l'ouvrir dans un logiciel :
docker compose cp app:/data/database.sqlite ./database-docker.sqlite
```

Avec une interface graphique, ouvrir le fichier `.sqlite` avec **DB Browser for
SQLite** (gratuit), **TablePlus**, l'extension VS Code *SQLite Viewer*, ou l'outil
base de données de PhpStorm / DataGrip.

## Commandes utiles

```bash
composer run test                     # tests (Pest)
npm run build                         # build front de production
php artisan migrate:fresh --seed      # réinitialise la base + données de démo
php artisan recap:send weekly         # envoi manuel des récapitulatifs
./vendor/bin/pint                     # formatage PHP (PSR-12)
```

## Structure

```
app/            Contrôleurs, modèles, services (points, e-mails), commande artisan
database/       Migrations, seeders (DatabaseSeeder + DemoSeeder), factory
resources/js/   Pages Inertia, composants React, hooks, données (niveaux, thèmes)
lang/           Fichiers de traduction
routes/         web.php, auth.php, console.php
docker/         Dockerfile + entrypoint.sh (image locale ; la prod utilise nixpacks.toml)
```

## Licence

MIT
