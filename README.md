# PomoBloom 🌱

**PomoBloom** is a gamified Pomodoro timer web application built with Laravel, Inertia.js and React. Focus, earn points, level up your plant avatar, and build consistent productivity habits.

---

## Features

### Core timer
- Pomodoro timer with configurable focus and break durations
- Auto-start breaks / auto-start pomodoros options
- Visual ring progress indicator + ambient audio cues
- Tab title updates in real time (shows countdown or "Break")

### Gamification
- Earn **points** for each completed Pomodoro session
- Bonus points for linked sessions (project or category attached)
- **20 plant-themed levels** — from Graine (seed) to Séquoia (sequoia)
- Level-up modal with animated celebration
- **Milestone rewards**: first project (+50 pts), first category (+50 pts), first linked Pomodoro (+75 pts)
- Full player profile page with progress bar and all-levels grid

### Projects & Categories
- Create unlimited projects and categories
- Link sessions to a project and/or one or more categories
- Monthly session counts per project on the dashboard
- Daily / monthly goals with progress tracking

### Tasks
- Lightweight task list on the dashboard
- Mark tasks complete at the end of a Pomodoro session

### Community — La Flamme
- Share quick victory messages after a session
- Like other users' victories
- Social proof bar for guest users (live feed of ongoing sessions)
- Guest upsell modal shown every 5 completed Pomodoros

### Statistics
- Session history with pagination
- Stats by period: today / this week / this month / all time
- Focus time per day chart
- Community leaderboard (weekly / monthly)

### Onboarding
- 8-step carousel modal shown once after registration
- Covers timer, projects, categories, points, La Flamme, themes, stats

### Multilingual
- Supports **6 languages**: French, English, Spanish, Italian, Portuguese, German
- Language switcher in the navbar (persisted to session + user account)
- All UI strings translated

### Themes
- Multiple visual themes selectable from the navbar
- Theme preference persisted per-user

### Guest mode
- Fully functional Pomodoro timer without an account
- Settings (durations, auto-start) stored in localStorage
- Task list stored in localStorage
- No data is sent to the server in guest mode

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.3) |
| Frontend | React 19 + TypeScript |
| Routing | Inertia.js v2 |
| Styling | Tailwind CSS v4 |
| Database | SQLite (dev) / MySQL (prod) |
| Auth | Laravel Breeze |
| Build | Vite 6 |
| i18n | Custom hook (`useTranslation`) + JSON lang files |

---

## Project structure

```
resources/js/
├── Components/        # Reusable UI components
│   ├── AppFooter.tsx
│   ├── GuestUpsellModal.tsx
│   ├── LocaleSwitcher.tsx
│   ├── OnboardingModal.tsx
│   ├── PlantAvatar.tsx
│   ├── PointsReward.tsx
│   ├── SocialProof.tsx
│   ├── ThemePicker.tsx
│   └── ...
├── data/
│   └── levels.ts      # 20 level definitions with colors and thresholds
├── hooks/
│   ├── useTranslation.ts
│   └── useLocalStorage.ts
├── Layouts/
│   └── AuthenticatedLayout.tsx
└── Pages/
    ├── Welcome.tsx    # Guest timer page
    ├── Dashboard.tsx  # Authenticated timer + dashboard
    ├── Stats.tsx
    ├── PlayerProfile.tsx
    ├── Help.tsx       # Articles + guide
    ├── Legal.tsx
    ├── Privacy.tsx
    └── ...

lang/                  # Translation files
├── en.json
├── fr.json
├── es.json
├── it.json
├── pt.json
└── de.json

app/Http/Controllers/
├── PomodoroSessionController.php
├── ProjectController.php
├── CategoryController.php
├── StatsController.php
├── VictoryMessageController.php
├── SocialProofController.php
└── ...
```

---

## Getting started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url> pomobloom
cd pomobloom

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start the dev servers
composer run dev
# or separately:
php artisan serve
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name |
| `APP_URL` | Full application URL |
| `DB_CONNECTION` | Database driver (`sqlite` / `mysql`) |
| `MAIL_*` | Mail configuration for email verification |

---

## License

MIT
