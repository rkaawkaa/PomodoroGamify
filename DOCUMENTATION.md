# PomoBloom — Documentation technique

Projet de **KAWKA Robin** — diplôme d'ingénieur CNAM, parcours AISL,
UE **GLG204 — Architectures logicielles Java (2)**
(responsable : Serge ROSMORDUC ; suivi : Pierre COURTIER).

Application web de minuteur Pomodoro gamifié : minuteur focus/pause, gain de
points, montée de niveaux (avatar évolutif), suivi de projets/catégories,
statistiques, objectifs, mur de victoires communautaire et récapitulatifs par
e-mail.

---

## 1. Stack technique

| Couche | Technologie |
|--------|-------------|
| Langage back | PHP 8.3 |
| Framework back | Laravel 12 |
| Pont front/back | Inertia.js v2 (`inertiajs/inertia-laravel`) |
| Front | React 18 + TypeScript |
| Build front | Vite 7 + `laravel-vite-plugin` |
| CSS | Tailwind CSS (utilitaires) + variables CSS personnalisées |
| Animations | Framer Motion |
| Icônes | lucide-react |
| Authentification | Laravel Breeze (scaffold Inertia/React) + Sanctum |
| Base de données | MySQL 8 (SQLite en mémoire uniquement pour la suite de tests) |
| E-mails | Resend (`resend/resend-laravel`) |
| Génération de routes JS | Ziggy (`tightenco/ziggy`) |
| Tests | Pest 4 (surcouche PHPUnit) |
| Qualité de code | Laravel Pint (PSR-12) |

L'application est un **monolithe** : pas d'API REST publique séparée. Le back-end
Laravel renvoie des composants React via Inertia (le contrôleur retourne
`Inertia::render('NomDeLaPage', [...props])` au lieu d'une vue Blade). Quelques
routes renvoient toutefois du JSON pur (création de session, toggle de like…),
consommées en `fetch`/`axios` depuis le front.

---

## 2. Architecture générale

### 2.1 Cycle d'une requête « page »

```
Navigateur
  │  GET /dashboard
  ▼
routes/web.php ──► middleware web :
  │                 - SetLocale                (choisit la langue)
  │                 - HandleInertiaRequests    (props partagées : auth, locale, translations…)
  │                 - auth + verified          (accès réservé aux comptes vérifiés)
  ▼
Closure / Contrôleur ──► requêtes Eloquent ──► Inertia::render('Dashboard', [...])
  ▼
Réponse Inertia (JSON si requête XHR Inertia, HTML complet au premier chargement)
  ▼
resources/js/app.tsx  monte  resources/js/Pages/Dashboard.tsx
```

### 2.2 Points d'entrée

| Fichier | Rôle |
|---------|------|
| `public/index.php` | Point d'entrée HTTP Laravel |
| `bootstrap/app.php` | Configuration de l'application (routing, middleware, exceptions) |
| `resources/views/app.blade.php` | Gabarit HTML racine ; contient `@inertia` et `@vite` |
| `resources/js/app.tsx` | Bootstrap React/Inertia ; résout dynamiquement `./Pages/*.tsx` |
| `resources/js/bootstrap.ts` | Configuration axios (CSRF, en-têtes) |

### 2.3 Middleware (enregistrés dans `bootstrap/app.php`)

Ajoutés au groupe `web` :

- **`App\Http\Middleware\SetLocale`** — détermine la langue active dans l'ordre :
  1. préférence de l'utilisateur connecté (`users.locale`),
  2. langue stockée en session (changement temporaire),
  3. en-tête `Accept-Language` du navigateur,
  4. `config('app.locale')` par défaut.
- **`App\Http\Middleware\HandleInertiaRequests`** — injecte les *props partagées*
  sur toutes les pages :
  - `auth.user` : l'utilisateur courant,
  - `locale` : langue active,
  - `translations` : contenu du fichier `lang/{locale}.json`,
  - `flash.award` : points gagnés flashés en session,
  - `support_email` : e-mail de support (variable d'environnement).
- `AddLinkHeadersForPreloadedAssets` — préchargement des assets Vite.

`trustProxies(at: '*')` est activé (déploiement derrière un proxy / HTTPS forcé
en production via `AppServiceProvider`).

---

## 3. Arborescence du projet

```
app/
├── Console/Commands/
│   └── SendRecapEmails.php        # commande artisan  recap:send {weekly|monthly|yearly}
├── Http/
│   ├── Controllers/
│   │   ├── Auth/                  # contrôleurs Breeze (login, register, reset…)
│   │   ├── AdminController.php    # mini back-office (auth séparée par session)
│   │   ├── CategoryController.php
│   │   ├── DeclaredSessionController.php   # déclaration manuelle de sessions passées
│   │   ├── GoalController.php
│   │   ├── LocaleController.php
│   │   ├── MessageLikeController.php
│   │   ├── PomodoroSessionController.php   # enregistrement d'une session terminée
│   │   ├── PomodoroSettingsController.php
│   │   ├── ProfileController.php
│   │   ├── ProjectController.php
│   │   ├── StatsController.php
│   │   ├── TaskController.php
│   │   └── VictoryMessageController.php    # mur des victoires « La Flamme »
│   ├── Middleware/
│   │   ├── HandleInertiaRequests.php
│   │   └── SetLocale.php
│   └── Requests/
│       ├── Auth/LoginRequest.php
│       └── ProfileUpdateRequest.php
├── Mail/
│   ├── WelcomeMail.php
│   ├── PasswordChangedMail.php
│   ├── WeeklyRecapMail.php
│   ├── MonthlyRecapMail.php
│   └── YearlyRecapMail.php
├── Models/
│   ├── Category.php
│   ├── MessageLike.php
│   ├── PomodoroSession.php
│   ├── Project.php
│   ├── Task.php
│   ├── User.php
│   ├── UserGoal.php
│   └── VictoryMessage.php
├── Points/
│   └── PointRules.php             # constantes de configuration de l'économie de points
├── Providers/
│   └── AppServiceProvider.php     # HTTPS forcé en prod, e-mails d'auth bilingues
└── Services/
    ├── PointService.php           # calcul et attribution des points
    └── RecapMailService.php       # agrégation des statistiques pour les récaps

database/
├── factories/UserFactory.php
├── migrations/                    # 19 migrations (voir §5.3)
└── seeders/
    ├── DatabaseSeeder.php         # appelle DemoSeeder
    └── DemoSeeder.php             # 6 comptes + données de démo (voir §5.5)

resources/
├── js/
│   ├── Components/                # ~55 composants React réutilisables
│   ├── Layouts/                   # AuthenticatedLayout, GuestLayout
│   ├── Pages/                     # pages Inertia (Welcome, Dashboard, Stats, PlayerProfile…)
│   ├── data/
│   │   ├── levels.ts             # 20 paliers de niveau + fonctions utilitaires
│   │   └── themes.ts             # 7 thèmes visuels (couleurs + titres de niveaux)
│   ├── hooks/
│   │   ├── useTranslation.ts     # const { t } = useTranslation()
│   │   ├── useTheme.tsx
│   │   └── useLocalStorage.ts
│   ├── lib/                       # utilitaires (cn(), thème)
│   └── types/                     # définitions TypeScript globales
└── views/
    ├── app.blade.php             # gabarit racine Inertia
    ├── admin/                     # vues Blade du back-office
    └── mail/                      # gabarits Markdown des e-mails

routes/
├── web.php                        # routes applicatives
├── auth.php                       # routes d'authentification (Breeze)
└── console.php                    # commande « inspire » + planification des récaps

lang/
├── {en,fr,es,it,pt,de}.json       # chaînes d'interface (JSON plat, clés en notation pointée)
└── {en,fr}/*.php                  # messages de validation / auth / pagination Laravel
```

---

## 4. Configuration et installation

### 4.1 Prérequis

- PHP 8.3+, Composer
- Node.js 20+, npm

### 4.2 Installation

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate           # crée le schéma
php artisan db:seed           # jeu de données de démo (voir §5.5)
composer run dev              # lance en parallèle : serveur PHP, worker de file, logs, Vite
```

L'application est ensuite accessible sur `http://localhost:8000`. Compte de démo
après seed : `marc@example.com` / `password`.

### 4.3 Variables d'environnement principales

| Variable | Rôle |
|----------|------|
| `APP_NAME` | Nom affiché de l'application (défaut : PomoBloom) |
| `APP_URL` | URL complète de l'application |
| `APP_ENV` / `APP_DEBUG` | Environnement et mode debug |
| `DB_CONNECTION` | `mysql` + `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` |
| `MAIL_MAILER` / `RESEND_API_KEY` | Envoi d'e-mails via Resend |
| `MAIL_FROM_ADDRESS` | Adresse expéditrice |
| `MAIL_SUPPORT` | Adresse de support affichée dans l'interface |

### 4.4 Scripts utiles

| Commande | Effet |
|----------|-------|
| `composer run dev` | Environnement de dev complet (serveur + queue + logs + Vite) |
| `composer run test` | Vide la config puis lance `php artisan test` |
| `npm run build` | Compile les assets front pour la production |
| `php artisan migrate:fresh --seed` | Réinitialise entièrement la base |
| `php artisan recap:send weekly` | Envoie manuellement les récaps hebdomadaires |
| `./vendor/bin/pint` | Formatage automatique du code PHP |

---

## 5. Base de données

Base : **MySQL 8** (conteneur `db` en Docker, plugin managé en production). La
suite de tests Pest utilise une base **SQLite en mémoire** (`phpunit.xml`).
Toutes les tables métier utilisent des clés étrangères avec suppression en
cascade (`cascadeOnDelete`) ou mise à `NULL` (`nullOnDelete`) selon le cas.

### 5.1 Tables techniques (scaffold Laravel)

| Table | Rôle |
|-------|------|
| `users` | Comptes (voir colonnes ajoutées ci-dessous) |
| `password_reset_tokens` | Jetons de réinitialisation de mot de passe |
| `sessions` | Sessions HTTP (driver session = database) |
| `cache`, `cache_locks` | Cache applicatif (driver database) |
| `jobs`, `job_batches`, `failed_jobs` | File d'attente (driver database) |

### 5.2 Tables métier

#### `users`

Colonnes de base : `id`, `name`, `email` (unique), `email_verified_at`,
`password`, `remember_token`, `created_at`, `updated_at`.

Colonnes ajoutées par migrations successives :

| Colonne | Type | Défaut | Rôle |
|---------|------|--------|------|
| `locale` | string(5) | `en` | Langue préférée |
| `pomodoro_duration` | smallint non signé | `25` | Durée focus (minutes) |
| `break_duration` | smallint non signé | `5` | Durée pause (minutes) |
| `auto_start_breaks` | bool | `false` | Démarrage auto des pauses |
| `auto_start_pomodoros` | bool | `false` | Démarrage auto du focus suivant |
| `points` | bigint non signé | `0` | Total cumulé de points |
| `onboarding_completed` | bool | `false` | Carrousel d'accueil déjà vu |
| `email_notifications` | bool | `false` | Opt-in aux récaps par e-mail |

#### `projects`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade à la suppression |
| `name` | string(40) | |
| `is_active` | bool (défaut `true`) | archivage sans suppression |
| `created_at` / `updated_at` | timestamps | |

#### `categories`

Structure identique à `projects` (`id`, `user_id`, `name(40)`, `is_active`,
timestamps). Un projet et des catégories peuvent être associés à une même
session.

#### `pomodoro_sessions`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `project_id` | FK → `projects.id`, nullable | `nullOnDelete` |
| `duration_seconds` | int non signé | durée réelle travaillée |
| `started_at` | timestamp nullable | début (ajouté ultérieurement) |
| `ended_at` | timestamp | fin — sert de date de référence pour toutes les stats |
| `is_declared` | bool (défaut `false`) | `true` si session saisie manuellement a posteriori |
| `created_at` / `updated_at` | timestamps | |

#### `category_pomodoro_session` (pivot)

| Colonne | Notes |
|---------|-------|
| `pomodoro_session_id` | FK, cascade |
| `category_id` | FK, cascade |
| PK composée `(pomodoro_session_id, category_id)` | relation N–N |

#### `tasks`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `title` | string | |
| `status` | enum(`pending`, `done`) | défaut `pending` |
| `completed_at` | timestamp nullable | |
| `session_id` | FK → `pomodoro_sessions.id`, nullable | `nullOnDelete` — tâche cochée à la fin d'une session |
| `created_at` / `updated_at` | timestamps | |

#### `user_goals`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `period_type` | enum(`daily`, `monthly`) | |
| `target` | int non signé | nombre de pomodoros visé |
| `project_id` | FK → `projects.id`, nullable | `NULL` = objectif global |
| `created_at` / `updated_at` | timestamps | |

Règle métier : un seul objectif `daily` par utilisateur (le `project_id` est
ignoré pour le quotidien) ; un objectif `monthly` par utilisateur **et par
projet** (`NULL` = global).

#### `point_events`

Journal d'audit de chaque attribution de points (permet de reconstituer le total).

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `event_key` | string | ex. `pomodoro_base`, `daily_first`, `milestone_total_100` |
| `points` | int non signé | points attribués par cet événement |
| `meta` | JSON nullable | contexte (`{"days": 5}`, `{"n": 7}`, `project_id`…) |
| `session_id` | FK → `pomodoro_sessions.id`, nullable | `nullOnDelete` |
| `created_at` / `updated_at` | timestamps | |
| Index | `(user_id, created_at)` | |

#### `victory_messages` (mur « La Flamme »)

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `content` | string(280) | message de victoire |
| `created_at` / `updated_at` | timestamps | |
| Index | `(user_id, created_at)`, `created_at` | |

#### `message_likes`

| Colonne | Type | Notes |
|---------|------|-------|
| `id` | bigint | PK |
| `user_id` | FK → `users.id` | cascade |
| `message_id` | FK → `victory_messages.id` | cascade |
| Contrainte | unique `(user_id, message_id)` | un like max par utilisateur et par message |

### 5.3 Relations (vue d'ensemble)

- `User` a plusieurs `Project`, `Category`, `PomodoroSession`, `Task`,
  `UserGoal`, `VictoryMessage`, `MessageLike`
- `User` a plusieurs lignes dans `point_events` (pas de modèle Eloquent dédié)
- `Project` a plusieurs `PomodoroSession` et `UserGoal` (`project_id` nullable)
- `PomodoroSession` est liée à plusieurs `Category` (relation N–N via
  `category_pomodoro_session`)
- `PomodoroSession` a plusieurs `Task` et plusieurs lignes `point_events`
  (`session_id` nullable, mis à `NULL` si la session est supprimée)
- `VictoryMessage` a plusieurs `MessageLike`

### 5.4 Liste des migrations (ordre chronologique)

| Fichier | Contenu |
|---------|---------|
| `0001_01_01_000000_create_users_table` | `users`, `password_reset_tokens`, `sessions` |
| `0001_01_01_000001_create_cache_table` | `cache`, `cache_locks` |
| `0001_01_01_000002_create_jobs_table` | `jobs`, `job_batches`, `failed_jobs` |
| `2026_02_25_081626_add_locale_to_users_table` | colonne `locale` |
| `2026_02_25_094224_add_pomodoro_settings_to_users_table` | durées + auto-start |
| `2026_02_25_130000_create_projects_table` | `projects` |
| `2026_02_25_130001_create_categories_table` | `categories` |
| `2026_02_25_200000_create_pomodoro_sessions_table` | `pomodoro_sessions` + pivot catégories |
| `2026_02_26_100000_create_tasks_table` | `tasks` |
| `2026_02_26_110000_add_started_at_to_pomodoro_sessions_table` | colonne `started_at` |
| `2026_02_26_110001_create_user_goals_table` | `user_goals` |
| `2026_02_26_130000_add_points_to_users_table` | colonne `points` |
| `2026_02_26_130001_create_point_events_table` | `point_events` |
| `2026_03_01_170620_create_victory_messages_table` | `victory_messages` |
| `2026_03_01_170621_create_message_likes_table` | `message_likes` |
| `2026_03_01_180000_add_onboarding_completed_to_users` | colonne `onboarding_completed` |
| `2026_03_30_000001_add_is_declared_to_pomodoro_sessions_table` | colonne `is_declared` |
| `2026_03_30_000002_add_email_notifications_to_users_table` | colonne `email_notifications` |

### 5.5 Seeder et factory

- **`database/seeders/DatabaseSeeder.php`** — appelle simplement `DemoSeeder`.
- **`database/seeders/DemoSeeder.php`** — génère un jeu de données de
  démonstration reproductible (`mt_srand` avec une graine fixe) :
  - **6 comptes** (`marc@example.com`, `claire@…`, `sofiane@…`, `emma@…`,
    `lucas@…`, `nadia@…`), mot de passe commun `password`. Le compte principal
    `marc@example.com` a `onboarding_completed = false` (le carrousel d'accueil
    s'affiche donc à la connexion) ; les autres l'ont à `true` ;
  - pour chaque compte : 3–5 projets, 4–6 catégories (dont 2 créées ces derniers
    jours), 9 à 58 sessions Pomodoro réparties sur le dernier mois (majorité de
    25 min, ~15 % déclarées manuellement, la plupart rattachées à un projet et à
    1–2 catégories), 5–15 tâches (mélange `pending` / `done`, les tâches
    terminées étant liées à une session), 2–3 objectifs (1 quotidien + 1–2
    mensuels), 0–3 messages de victoire ;
  - un **historique `point_events` cohérent** : une ligne `pomodoro_base` (+10)
    par session, plus des bonus simulés (`daily_first`, `streak_days`,
    `random_reward`, paliers `milestone_total_*`) ; `users.points` est ensuite
    fixé à la somme exacte de ces événements ;
  - des `message_likes` croisés entre comptes.
  Le seeder purge d'abord les données rattachées à ces 6 comptes, il peut donc
  être relancé sans dupliquer.
- **`database/factories/UserFactory.php`** — génère un utilisateur avec nom et
  e-mail aléatoires (Faker), e-mail vérifié, mot de passe `password`,
  `remember_token` aléatoire. État `unverified()` disponible pour les tests.
  Pas de factory pour les autres modèles : `DemoSeeder` construit les données
  directement via Eloquent.

Commandes : `php artisan db:seed` (ajoute les données de démo) ou
`php artisan migrate:fresh --seed` (repart d'une base vierge).

---

## 6. Modèles Eloquent

| Modèle | Relations | Casts notables |
|--------|-----------|----------------|
| `User` | `projects`, `categories`, `pomodoroSessions`, `tasks`, `goals` (tous `hasMany`) | `password` → `hashed`, booléens de réglages, `points` → int |
| `Project` | `user` (`belongsTo`) | `is_active` → bool |
| `Category` | `user` | `is_active` → bool |
| `PomodoroSession` | `user`, `project` (`belongsTo`), `categories` (`belongsToMany`), `tasks` (`hasMany` sur `session_id`) | `started_at`/`ended_at` → datetime, `is_declared` → bool |
| `Task` | `user`, `session` (`belongsTo` sur `session_id`) | `completed_at` → datetime |
| `UserGoal` | `user`, `project` | — |
| `VictoryMessage` | `user`, `likes` (`hasMany` sur `message_id`) | — |
| `MessageLike` | `user`, `message` (`belongsTo` sur `message_id`) | — |

Il n'y a **pas** de modèle `PointEvent` : la table `point_events` est alimentée
directement via le *query builder* (`DB::table(...)->insert(...)`) dans
`PointService`.

---

## 7. Routing

### 7.1 Routes publiques (`routes/web.php`)

| Méthode | URI | Cible | Nom |
|---------|-----|-------|-----|
| GET | `/` | redirige vers `dashboard` si connecté, sinon page `Welcome` | `welcome` |
| GET | `/landing` | page marketing `Landing` | `landing` |
| GET | `/guide` | page `Help` | `help` |
| GET | `/legal` | page `Legal` | `legal` |
| GET | `/privacy` | page `Privacy` | `privacy` |
| POST | `/locale` | `LocaleController@update` (change la langue en session) | `locale.update` |

### 7.2 Routes authentifiées (`middleware('auth')`, `/dashboard` en plus `verified`)

| Méthode | URI | Cible | Nom |
|---------|-----|-------|-----|
| GET | `/dashboard` | closure — charge réglages, projets, catégories, tâches, objectifs, compteurs | `dashboard` |
| GET | `/profile` | `ProfileController@edit` | `profile.edit` |
| PATCH | `/profile` | `ProfileController@update` | `profile.update` |
| DELETE | `/profile` | `ProfileController@destroy` | `profile.destroy` |
| PATCH | `/settings/pomodoro` | `PomodoroSettingsController@update` | `settings.pomodoro` |
| POST/PATCH/DELETE | `/projects`, `/projects/{project}` | `ProjectController` | `projects.*` |
| POST/PATCH/DELETE | `/categories`, `/categories/{category}` | `CategoryController` | `categories.*` |
| POST | `/pomodoro-sessions` | `PomodoroSessionController@store` (JSON) | `pomodoro-sessions.store` |
| POST | `/sessions/declare` | `DeclaredSessionController@store` (JSON) | `sessions.declare` |
| POST/PATCH/DELETE | `/tasks`, `/tasks/{task}` | `TaskController` | `tasks.*` |
| POST | `/goals` | `GoalController@upsert` | `goals.upsert` |
| DELETE | `/goals/{id}` | `GoalController@destroy` | `goals.destroy` |
| GET | `/player-profile` | closure → page `PlayerProfile` | `player-profile` |
| GET | `/stats` | `StatsController@index` | `stats` |
| POST | `/onboarding/complete` | closure — passe `onboarding_completed` à `true` | `onboarding.complete` |
| GET | `/victory-messages` | `VictoryMessageController@index` | `victory-messages.index` |
| POST | `/victory-messages` | `VictoryMessageController@store` | `victory-messages.store` |
| DELETE | `/victory-messages/{victoryMessage}` | `VictoryMessageController@destroy` | `victory-messages.destroy` |
| POST | `/victory-messages/{victoryMessage}/like` | `MessageLikeController@toggle` | `victory-messages.like` |

### 7.3 Routes d'authentification (`routes/auth.php`)

Scaffold Breeze standard : `register`, `login`, `logout`, `forgot-password`,
`reset-password`, `verify-email`, `confirm-password`, `password.update`. La
connexion accepte l'e-mail **ou** le nom d'utilisateur (`LoginRequest`).

### 7.4 Back-office (`prefix('admin')`)

`admin.login` (GET/POST), `admin.logout` (POST), `admin.dashboard` (GET).
Authentification **indépendante** du système Breeze : comparaison à des
identifiants et stockage d'un booléen en session (`admin_auth`). Voir §13.

### 7.5 Console (`routes/console.php`)

- `inspire` — commande de démonstration Laravel.
- Planification (`Schedule`) :
  - `recap:send weekly` — chaque dimanche à 19 h 00,
  - `recap:send monthly` — dernier jour du mois à 18 h 00,
  - `recap:send yearly` — 31 décembre à 18 h 00.
  Toutes en `withoutOverlapping()->runInBackground()`. Nécessite un cron système
  appelant `php artisan schedule:run` chaque minute.

---

## 8. Système de points

### 8.1 `app/Points/PointRules.php`

Classe `final` ne contenant que des **constantes** : c'est le fichier de
configuration de l'« économie » de points, séparé de la logique.

| Constante | Valeur | Signification |
|-----------|--------|---------------|
| `POMODORO_BASE` | 10 | points pour toute session terminée |
| `DAILY_COUNT_BONUSES` | `{1: 25, 4: 40}` | bonus au 1ᵉʳ et au 4ᵉ pomodoro du jour |
| `DAILY_SCALING_START` / `_BASE` / `_INCREMENT` | 6 / 5 / 5 | à partir du 6ᵉ pomodoro du jour : `5 + (n-6)*5` |
| `STREAK_MIN_DAYS` / `STREAK_BONUS` | 3 / 30 | bonus par session si série ≥ 3 jours consécutifs |
| `TASK_DAILY_BONUSES` | `{1: 20, 5: 50, 10: 100}` | bonus à la Nᵉ tâche terminée dans la journée |
| `MILESTONES_TOTAL_POMODOROS` | `{1:100, 5:50, 10:75, 100:200, 1000:500, 10000:1000}` | paliers sur le total de pomodoros |
| `MILESTONES_SCOPED_POMODOROS` | `{10:30, 100:100, 1000:300}` | paliers par projet **ou** par catégorie |
| `MILESTONES_TOTAL_HOURS` | `{10:150, 100:500, 500:2000}` | paliers d'heures de focus cumulées |
| `MILESTONES_SCOPED_HOURS` | `{10:75, 100:250, 500:1000}` | idem par projet / catégorie |
| `RANDOM_CHANCE` / `RANDOM_MIN` / `RANDOM_MAX` | 0.05 / 5 / 30 | 5 % de chance d'un bonus aléatoire après une session |

### 8.2 `app/Services/PointService.php`

Service injecté dans les contrôleurs. Deux points d'entrée publics :

- **`awardPomodoro(User $user, PomodoroSession $session, array $categoryIds): array`**
  Appelé **après** persistance de la session et de ses catégories (les calculs
  reposent sur des `COUNT`/`SUM` qui doivent inclure la nouvelle session).
  Enchaîne 11 règles :
  1. points de base,
  2. bonus de comptage journalier (1ᵉʳ, 4ᵉ),
  3. bonus progressif à partir du 6ᵉ du jour,
  4. bonus de série de jours consécutifs (`computeStreak`),
  5. palier sur le total de pomodoros,
  6. palier par projet,
  7. palier par catégorie,
  8. paliers d'heures de focus cumulées (déclenchés au franchissement),
  9. paliers d'heures par projet,
  10. paliers d'heures par catégorie,
  11. bonus aléatoire (5 %).

  Chaque règle produit un « award » `{event_key, points, meta}`. À la fin,
  `persist()` insère toutes les lignes dans `point_events` et incrémente
  `users.points` du total.

- **`awardTask(User $user): array`** — appelé après passage d'une tâche à
  `done` ; applique `TASK_DAILY_BONUSES` selon le nombre de tâches terminées
  aujourd'hui.

Méthodes privées : agrégats SQL (`todayPomodoroCount`, `totalPomodoroSeconds`,
`categoryPomodoroCount` via jointure sur le pivot…) et `computeStreak()` qui
compte les jours consécutifs (terminant aujourd'hui) comportant au moins une
session.

### 8.3 Bonus gérés hors service

Dans `PomodoroSessionController@store` :

- **Premier pomodoro « lié »** (projet ou catégorie renseigné) : +75 points,
  `event_key = first_linked_pomodoro`.
- Tous les 10 pomodoros, la réponse JSON inclut le message de victoire le plus
  liké des dernières 24 h (d'un autre utilisateur) pour l'afficher côté front.

### 8.4 Niveaux — `resources/js/data/levels.ts`

20 paliers définis par un seuil de points cumulés (`minPoints`), du niveau 1
(0 pt) au niveau 20 (70 000 pts). Fonctions exportées :

- `getLevelForPoints(points)` → objet `Level` courant,
- `getNextLevel(level)` → palier suivant ou `null` si niveau max,
- `getLevelProgress(points)` → flottant `[0, 1]` de progression vers le palier
  suivant.

Les libellés et couleurs de niveau dépendent du **thème** choisi
(`resources/js/data/themes.ts`, 7 thèmes : botanique, guerrier, etc., chacun
avec 20 titres FR/EN et un jeu de couleurs). La détection de montée de niveau se
fait côté front en comparant l'ancien et le nouveau total (`prevUserPointsRef`),
ce qui déclenche `LevelUpModal`.

---

## 9. Statistiques — `StatsController@index`

Page `Stats.tsx` à 3 onglets (Vue d'ensemble / Historique / Classement).
Filtres acceptés en query string : `project`, `category`, `period`
(`today|week|month|all`), `source` (`all|real|declared`), `history_page`.

- **Fabrique de requête filtrée** (`$makeQuery`) réutilisée pour les KPI et
  l'historique : filtre par projet, catégorie (via `whereHas`), période et
  source.
- **KPI** : nombre de sessions, secondes totales, série courante et meilleure
  série (`calculateStreaks`, toujours *all-time*), moyenne journalière.
- **Graphiques** : `getDailyChart` (14 derniers jours) et `getWeeklyChart`
  (8 dernières semaines), sensibles aux filtres projet/catégorie mais à fenêtre
  temporelle fixe. Rendus en barres SVG côté front.
- **Historique** : sessions paginées par 15 (nom de page `history_page` pour ne
  pas entrer en conflit avec `page`), avec projet, catégories et tâches liées.
- **Classement** (`getLeaderboard`) : jointure `pomodoro_sessions × users`,
  regroupée par utilisateur, triée par nombre de sessions, top 50, pour la
  semaine et le mois en cours. Non filtré (vue globale).

---

## 10. Sessions déclarées manuellement

`DeclaredSessionController@store` (`POST /sessions/declare`) permet d'ajouter une
session de travail passée : `worked_at` (date ≤ maintenant), `duration_minutes`
(1–600), projet et catégories optionnels. `started_at` est recalculé par
soustraction, `is_declared = true`. Les points sont attribués via le même
`PointService` ; les bonus journaliers ne se déclenchent que si `ended_at`
tombe aujourd'hui, les bonus de palier et de série s'appliquent normalement.
Dans l'historique et les stats, ces sessions portent un badge distinct.

---

## 11. Objectifs — `GoalController`

- `POST /goals` (`upsert`) : `updateOrCreate` sur `(user_id, period_type,
  project_id)`. Pour `daily`, `project_id` est forcé à `NULL`.
- `DELETE /goals/{id}` : suppression restreinte aux objectifs de l'utilisateur.

L'avancement est calculé et affiché côté `Dashboard` à partir des compteurs de
sessions du jour / du mois.

---

## 12. Communauté « La Flamme »

- `VictoryMessageController` : liste (avec `likes_count` et `user_liked`),
  création (message ≤ 280 caractères), suppression (auteur uniquement).
- `MessageLikeController@toggle` : ajoute / retire un like ; la contrainte
  unique `(user_id, message_id)` garantit l'unicité.
- En mode invité, `GuestUpsellModal` est affiché tous les 5 pomodoros pour
  inciter à créer un compte.

---

## 13. Panneau d'administration

`AdminController` — mini back-office rendu en **Blade** (hors Inertia),
totalement séparé de l'authentification des utilisateurs :

- identifiants comparés à des constantes de classe,
- succès → booléen `admin_auth` en session,
- chaque méthode vérifie ce booléen en début de traitement (pas de middleware
  dédié),
- tableau de bord : nombre d'utilisateurs, nombre de sessions, sessions HTTP
  actives, et liste des utilisateurs triés par nombre de pomodoros.

> ⚠️ **À corriger avant rendu / mise en production** : les identifiants
> d'administration sont actuellement **en clair dans le code source**
> (`app/Http/Controllers/AdminController.php`). Il faut les déplacer en variables
> d'environnement et, idéalement, remplacer la vérification manuelle par un
> middleware (`EnsureAdmin`) et un hachage de mot de passe.

---

## 14. Internationalisation

- **Interface** : fichiers `lang/{locale}.json` (JSON plat, clés en notation
  pointée, ex. `"timer.start": "Démarrer"`). Chargés intégralement dans les
  props Inertia partagées par `HandleInertiaRequests`, puis exposés côté React
  via le hook `useTranslation` → `const { t } = useTranslation()` ;
  `t('timer.start')`. Le hook est utilisable dans n'importe quel sous-composant
  sans *prop drilling*.
- **Messages Laravel** (validation, auth, pagination) : `lang/{en,fr}/*.php`.
- **Langues fournies** : en, fr, es, it, pt, de (l'interface est traduite dans
  les 6 ; `SetLocale` restreint par `config('app.supported_locales')`).
- **Changement de langue** : `POST /locale` (invité, stocké en session) ou
  mise à jour de `users.locale` (connecté).

---

## 15. E-mails

Transport : **Resend**. Gabarits Markdown dans `resources/views/mail/`.

| Classe Mailable | Déclencheur |
|-----------------|-------------|
| `WelcomeMail` | après inscription |
| `PasswordChangedMail` | après réinitialisation réussie (event `PasswordReset`, câblé dans `AppServiceProvider`) |
| `WeeklyRecapMail` / `MonthlyRecapMail` / `YearlyRecapMail` | commande `recap:send` planifiée |

- L'e-mail de **demande** de réinitialisation est personnalisé (bilingue) via
  `ResetPassword::toMailUsing()` dans `AppServiceProvider`.
- **`SendRecapEmails`** (`recap:send {type}`) : parcourt les utilisateurs ayant
  `email_notifications = true`, calcule leurs stats de période via
  `RecapMailService::stats()` (sessions, heures, jours actifs, top 5
  projets/catégories, meilleur jour), n'envoie que si au moins une session sur
  la période, capture les exceptions par utilisateur pour ne pas interrompre le
  lot.
- **`RecapMailService`** expose aussi `fmtSeconds()` (formatage « Xh Ym ») et
  `encouragement($locale)` (phrase d'encouragement aléatoire FR/EN).

---

## 16. Mode invité

Le minuteur est pleinement fonctionnel sans compte (`Welcome.tsx`) :

- réglages (durées, auto-start) et liste de tâches stockés en `localStorage`
  (`useLocalStorage`, `GuestSettingsModal`, `GuestTaskList`),
- aucune donnée envoyée au serveur,
- `GuestUpsellModal` incite à créer un compte tous les 5 pomodoros,
- le titre de l'onglet du navigateur reflète le décompte en cours.

---

## 17. Front-end

- **Pages** (`resources/js/Pages/`) : `Welcome` (invité), `Dashboard`
  (minuteur + tableau de bord connecté, ~940 lignes), `Stats`, `PlayerProfile`,
  `Help`, `Landing`, `Legal`, `Privacy`, `Profile/Edit`, pages `Auth/*`.
- **Layouts** : `AuthenticatedLayout` (barre de navigation + `UserMenu` avec
  avatar et niveau), `GuestLayout`.
- **Composants notables** : `PlantAvatar` / `Avatar` (avatars SVG par niveau et
  par thème), `LevelUpModal`, `PointsReward` (toast persistant jusqu'à
  fermeture), `OnboardingModal` (carrousel 8 étapes), `DeclareSessionModal`,
  `GoalsModal`, `ManageItemsModal`, `ThemePicker`, `LocaleSwitcher`,
  `VictoryWallModal`.
- **Minuteur** : machine à états focus/pause × idle/running/paused ;
  sons via Web Audio API en fin de phase ; notifications navigateur via Service
  Worker ; sauvegarde de la session en base en fin naturelle ou arrêt manuel
  au-delà d'un seuil.
- **Style** : Tailwind + palette « Nightbloom » exposée en variables CSS
  (`--color-ember`, `--color-bloom`, …), utilisées en styles *inline* pour les
  SVG. Thème clair / sombre commutable.

---

## 18. Tests

`tests/` (Pest) : essentiellement le socle Breeze —
`Feature/Auth/*` (inscription, connexion, réinitialisation, vérification
d'e-mail, mise à jour du mot de passe), `Feature/ProfileTest`,
`Feature/ExampleTest`, `Unit/ExampleTest`. La logique métier
(points, statistiques, objectifs) n'est pas encore couverte — c'est le premier
axe d'enrichissement des tests.

Lancement : `composer run test` ou `php artisan test`.

---

## 19. Docker et déploiement

### 19.1 Image Docker locale

Le stack Docker sert **uniquement au poste local**. La production continue
d'utiliser `nixpacks.toml` (voir §19.2) ; pour éviter toute détection
automatique du builder par l'hébergeur, le `Dockerfile` est rangé dans `docker/`
et non à la racine.

**4 services** (`docker-compose.yml`) :

| Service | Image | Port | Rôle |
|---------|-------|------|------|
| `app` | build `docker/Dockerfile` | 8000 | Laravel + front compilé |
| `db` | `mysql:8.0` | — | base `pomobloom` (user/pass `pomobloom`), volume `db-data` |
| `phpmyadmin` | `phpmyadmin:5.2` | 8081 | interface web de la base |
| `mailpit` | `axllent/mailpit` | 8025 | capture de tous les e-mails (SMTP interne `mailpit:1025`) |

- **`docker/Dockerfile`** — build multi-étapes :
  1. `node:20` compile les assets front (`npm ci && npm run build`),
  2. `php:8.3-cli` installe les extensions (`pdo_mysql`, `pdo_sqlite`, `bcmath`,
     `zip`), Composer, le code et les assets, puis `composer install --no-dev`.
- **`docker/entrypoint.sh`** — au démarrage du conteneur `app` : crée `.env` +
  `APP_KEY`, reporte les variables de `docker-compose.yml` dans `.env`, **attend
  que MySQL réponde**, lance `php artisan migrate --force` puis
  `php artisan db:seed` (désactivable avec `SEED=false`), et démarre
  `php artisan serve` sur `0.0.0.0:8000`.
- `app` démarre après `db` (`depends_on: condition: service_healthy`).

```bash
docker compose up --build      # app :8000 · phpMyAdmin :8081 · Mailpit :8025
docker compose down -v         # arrêt + suppression de la base
```

Comptes : `marc@example.com` / `password` (app), `admin@example.com` / `password`
(`/admin/login`). Le workflow local sans Docker (§4) reste inchangé.

### 19.2 Déploiement PaaS

- `nixpacks.toml` + `.php-version` : configuration pour un hébergeur type
  Railway/Nixpacks.
- `AppServiceProvider` force le schéma HTTPS en production.
- Étapes attendues : `composer install --no-dev`, `npm ci && npm run build`,
  `php artisan migrate --force`, configuration des variables d'environnement
  (base MySQL, `RESEND_API_KEY`), mise en place d'un cron
  `* * * * * php artisan schedule:run` pour les récaps.

---

## 20. Limites connues / pistes d'amélioration

1. **Identifiants admin en clair** dans `AdminController` → variables
   d'environnement + middleware + hachage.
2. **Couverture de tests** limitée au périmètre d'authentification → ajouter des
   tests sur `PointService`, `StatsController`, `GoalController`.
3. **`PointService` : nombre de requêtes** — chaque session déclenche de
   nombreux `COUNT`/`SUM`. Envisager de mettre en cache certains agrégats ou de
   les stocker de façon incrémentale.
4. **Table `point_events` sans modèle** ni possibilité de « rejouer » l'historique
   pour recalculer `users.points`.
5. **Données de démo construites à la main** dans `DemoSeeder` — des *factories*
   dédiées par modèle rendraient l'ensemble plus modulaire et réutilisable dans
   les tests.
6. **`calculateStreaks` et `computeStreak`** dupliquent une logique proche dans
   deux fichiers (`StatsController` et `PointService`) → factoriser.
