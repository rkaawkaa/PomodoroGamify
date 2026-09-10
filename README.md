# PomoBloom

Projet réalisé par **KAWKA Robin** dans le cadre du **diplôme d'ingénieur du
CNAM**, spécialité Informatique, parcours *Architecture et ingénierie des
systèmes et logiciels (AISL)*.

**UE GLG204 — Architectures logicielles Java (2)**
Responsable de l'UE : Serge ROSMORDUC · Suivi : Pierre COURTIER

---

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
| Base de données | MySQL 8 |
| Auth | Laravel Breeze |
| E-mails | Resend (prod) / Mailpit (Docker) |
| Tests | Pest |

## Démarrage avec Docker (recommandé)

Seul **Docker** est requis : Docker Desktop **4.x ou plus récent** (ou, sous
Linux, Docker Engine **20.10+** avec le plugin `docker compose` v2). Une seule
commande construit l'application, démarre la base, applique les migrations et
charge des données de démonstration :

```bash
docker compose up --build
```

Laisse ~30–40 s le temps que MySQL démarre au premier lancement. Ensuite tout est
accessible :

| Service | URL | Identifiants |
|---------|-----|-------------|
| **Application** | http://localhost:8000 | `marc@example.com` / `password` |
| **Espace admin** | http://localhost:8000/admin/login | `admin@example.com` / `password` |
| **phpMyAdmin** (base de données) | http://localhost:8081 | `pomobloom` / `pomobloom` (ou `root` / `root`) |
| **Mailpit** (e-mails envoyés par l'app) | http://localhost:8025 | — |

Autres comptes de démo (onboarding déjà fait, même mot de passe `password`) :
`claire@example.com`, `sofiane@example.com`, `emma@example.com`,
`lucas@example.com`, `nadia@example.com`.

### Ce que lance `docker compose up`

| Conteneur | Rôle |
|-----------|------|
| `app` | Laravel + front compilé, servi sur le port 8000 |
| `db` | MySQL 8 — données persistées dans le volume Docker `db-data` |
| `phpmyadmin` | interface web de la base |
| `mailpit` | serveur SMTP factice : capture **tous** les e-mails, rien n'est réellement envoyé |

Au premier démarrage, le conteneur `app` attend MySQL puis exécute
`php artisan migrate` et `php artisan db:seed` (voir
[Données de démonstration](#données-de-démonstration)).

### Commandes Docker utiles

```bash
docker compose up -d --build                              # démarrer en arrière-plan
docker compose logs -f app                                # suivre les logs de l'app
docker compose exec app php artisan migrate:fresh --seed  # réinitialiser les données de démo
docker compose down                                       # arrêter
docker compose down -v                                    # arrêter + supprimer la base
```

Pour ne **pas** recharger les données de démo à chaque redémarrage, passe
`SEED: "false"` dans `docker-compose.yml`.
Si un port est déjà pris sur ta machine (8000 / 8081 / 8025), change le premier
nombre du mapping `ports` correspondant dans `docker-compose.yml`.

## Installation manuelle (sans Docker)

Prérequis sur la machine :

- **PHP 8.3+** avec les extensions habituelles de Laravel
  (`pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `curl`,
  `fileinfo`, `bcmath`) — distribution type Laragon, XAMPP, Herd ou PHP système
- **Composer 2**
- **Node.js 20+** et **npm**
- **MySQL 8** avec une base et un utilisateur dédiés. Pas de serveur mail requis.

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# renseigner DB_* dans .env, puis :
php artisan migrate        # crée les tables
php artisan db:seed        # jeu de données de démo (voir ci-dessous)

composer run dev           # serveur PHP + worker + logs + Vite, sur :8000
```

Pour lancer les services séparément : `php artisan serve` et `npm run dev`.
En dev manuel, mettre `MAIL_MAILER=log` dans `.env` pour écrire les e-mails dans
`storage/logs/laravel.log` au lieu de les envoyer.

## Données de démonstration

Le seeder `DemoSeeder` (`database/seeders/DemoSeeder.php`) crée **6 comptes**
(mot de passe commun : `password`), chacun avec des projets, des catégories
récemment créées, des tâches (en cours et terminées), un historique de sessions
Pomodoro réparti sur le dernier mois, des objectifs, des messages de victoire et
l'historique de points correspondant. Le jeu de données est **reproductible**
(graine fixe) et le seeder est **rejouable** (il purge d'abord ces 6 comptes).

| Compte | Particularité |
|--------|---------------|
| `marc@example.com` | compte principal, gros historique, **onboarding non fait** (le carrousel s'affiche à la connexion) |
| `claire@` `sofiane@` `emma@` `lucas@` `nadia@` `example.com` | volumes d'activité variés, onboarding fait |

```bash
php artisan db:seed                  # (re)charger les données de démo
php artisan migrate:fresh --seed     # tout réinitialiser puis recharger
```

## Comptes

| Type | URL | E-mail | Mot de passe |
|------|-----|--------|--------------|
| Utilisateur de démo | `/login` | `marc@example.com` | `password` |
| Administration | `/admin/login` | `admin@example.com` | `password` |

Le panneau `/admin` est **indépendant** du système de comptes utilisateurs
(pas de `User` admin, juste un identifiant/mot de passe). Il affiche le nombre
d'utilisateurs, de sessions Pomodoro et de sessions HTTP actives, plus la liste
des utilisateurs triés par nombre de pomodoros. Identifiants surchargeables via
`ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env`.

## Inspecter la base de données

**Avec Docker** : ouvrir **phpMyAdmin → http://localhost:8081**
(`pomobloom` / `pomobloom`). Base `pomobloom`.

**En ligne de commande** (Docker : préfixer par `docker compose exec app`) :

```bash
php artisan db:show                   # liste des tables + nombre de lignes
php artisan db:table users            # colonnes, index et clés d'une table
php artisan db                        # shell SQL interactif
php artisan tinker                    # console Eloquent
```

**En dehors de phpMyAdmin** : n'importe quel client MySQL (TablePlus, DBeaver,
DataGrip, `mysql` en ligne de commande) sur la base `pomobloom`.

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
