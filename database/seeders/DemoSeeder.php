<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PomodoroSession;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\UserGoal;
use App\Models\VictoryMessage;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Crée un jeu de données de démonstration : quelques comptes, chacun avec des
 * projets, catégories, tâches, sessions Pomodoro récentes, objectifs, messages
 * de victoire et l'historique de points correspondant.
 *
 * Compte principal pour se connecter :  marc@example.com  /  password
 */
class DemoSeeder extends Seeder
{
    /** Rend le jeu de données stable d'une exécution à l'autre. */
    private const RANDOM_SEED = 20260908;

    private array $projectNames = [
        'Mémoire GLG204', 'Refonte du site perso', 'Préparation certif AWS',
        'Application mobile', 'Cours du soir', 'Veille technique',
        'Mission freelance', 'Apprentissage Rust', 'Blog technique',
    ];

    private array $categoryNames = [
        'Développement', 'Rédaction', 'Lecture', 'Révisions', 'Administratif',
        'Design', 'Tests', 'Recherche', 'Réunions',
    ];

    private array $taskTitles = [
        "Rédiger l'introduction", 'Corriger les retours du tuteur',
        'Mettre en place le pipeline CI', 'Relire le chapitre 3',
        'Préparer la démo de vendredi', 'Refactorer le module authentification',
        'Répondre aux e-mails en attente', 'Faire les exercices du TD4',
        "Documenter l'API REST", 'Optimiser les requêtes SQL lentes',
        'Réviser les design patterns', 'Trier la bibliographie',
        'Écrire les tests de la page Stats', 'Maquetter le tableau de bord',
        'Déployer la préproduction',
    ];

    private array $victoryMessages = [
        'Enfin fini ce chapitre, ça fait du bien !',
        "4 pomodoros d'affilée, grosse matinée.",
        'Petit pas mais régulier, la série continue.',
        'La certif approche, révisions bouclées pour aujourd\'hui.',
        'Semaine terminée dans les temps.',
        "J'ai enfin compris le pattern Observer.",
        'Objectif du jour atteint avant midi.',
    ];

    public function run(): void
    {
        mt_srand(self::RANDOM_SEED);

        // 'onboarded' => false pour le compte de démo principal : l'onboarding
        // s'affiche donc à la première connexion.
        $accounts = [
            ['name' => 'Marc Lefèvre',      'email' => 'marc@example.com',    'locale' => 'fr', 'volume' => 'gros',  'onboarded' => false],
            ['name' => 'Claire Nguyen',     'email' => 'claire@example.com',  'locale' => 'fr', 'volume' => 'moyen'],
            ['name' => 'Sofiane Belkacem',  'email' => 'sofiane@example.com', 'locale' => 'fr', 'volume' => 'moyen'],
            ['name' => 'Emma Rossi',        'email' => 'emma@example.com',    'locale' => 'en', 'volume' => 'petit'],
            ['name' => 'Lucas Martin',      'email' => 'lucas@example.com',   'locale' => 'fr', 'volume' => 'moyen'],
            ['name' => 'Nadia Haddad',      'email' => 'nadia@example.com',   'locale' => 'fr', 'volume' => 'petit'],
        ];

        $users = [];

        foreach ($accounts as $data) {
            $users[] = $this->createUser($data);
        }

        // Likes croisés sur les messages de victoire
        $this->seedLikes($users);

        $this->command?->info('Comptes de démonstration créés (mot de passe : « password ») :');
        foreach ($users as $user) {
            $this->command?->line("  - {$user->email}  ({$user->points} pts)");
        }
    }

    private function createUser(array $data): User
    {
        $volume = $data['volume'];
        $sessionCount = match ($volume) {
            'gros'  => mt_rand(46, 58),
            'moyen' => mt_rand(20, 34),
            default => mt_rand(9, 16),
        };

        $user = User::updateOrCreate(
            ['email' => $data['email']],
            [
                'name'                 => $data['name'],
                'password'             => Hash::make('password'),
                'email_verified_at'    => now()->subDays(mt_rand(30, 90)),
                'locale'               => $data['locale'],
                'pomodoro_duration'    => [25, 25, 25, 30, 50][mt_rand(0, 4)],
                'break_duration'       => [5, 5, 5, 10][mt_rand(0, 3)],
                'auto_start_breaks'    => (bool) mt_rand(0, 1),
                'auto_start_pomodoros' => (bool) mt_rand(0, 1),
                'onboarding_completed' => $data['onboarded'] ?? true,
                'email_notifications'  => (bool) mt_rand(0, 1),
                'points'               => 0,
            ]
        );

        // Repart d'une base propre si le seeder est relancé
        $user->pomodoroSessions()->delete();
        $user->tasks()->delete();
        $user->projects()->delete();
        $user->categories()->delete();
        $user->goals()->delete();
        VictoryMessage::where('user_id', $user->id)->delete();
        DB::table('point_events')->where('user_id', $user->id)->delete();

        $projects   = $this->createProjects($user);
        $categories = $this->createCategories($user);
        $sessions   = $this->createSessions($user, $projects, $categories, $sessionCount);
        $this->createTasks($user, $sessions, $volume);
        $this->createGoals($user, $projects);
        $this->createVictoryMessages($user, $volume);
        $this->awardPoints($user, $sessions, $volume);

        return $user->refresh();
    }

    /** @return Project[] */
    private function createProjects(User $user): array
    {
        $names = $this->pick($this->projectNames, mt_rand(3, 5));
        $projects = [];

        foreach ($names as $i => $name) {
            $createdAt = now()->subDays(mt_rand(18, 45))->setTime(mt_rand(8, 20), mt_rand(0, 59));
            $project = new Project([
                'user_id'   => $user->id,
                'name'      => $name,
                'is_active' => $i === 0 ? true : (bool) mt_rand(0, 5), // le 1er toujours actif
            ]);
            $project->created_at = $createdAt;
            $project->updated_at = $createdAt;
            $project->save();
            $projects[] = $project;
        }

        return $projects;
    }

    /** @return Category[] */
    private function createCategories(User $user): array
    {
        $names = $this->pick($this->categoryNames, mt_rand(4, 6));
        $categories = [];

        foreach ($names as $i => $name) {
            // Quelques catégories créées tout récemment, les autres il y a plusieurs semaines
            $createdAt = $this->pastAt($i < 2
                ? now()->subDays(mt_rand(0, 4))->setTime(mt_rand(8, 20), mt_rand(0, 59))
                : now()->subDays(mt_rand(15, 40))->setTime(mt_rand(8, 20), mt_rand(0, 59)));

            $category = new Category([
                'user_id'   => $user->id,
                'name'      => $name,
                'is_active' => true,
            ]);
            $category->created_at = $createdAt;
            $category->updated_at = $createdAt;
            $category->save();
            $categories[] = $category;
        }

        return $categories;
    }

    /** @return PomodoroSession[] */
    private function createSessions(User $user, array $projects, array $categories, int $count): array
    {
        $durations = [1500, 1500, 1500, 1500, 1500, 3000, 1200, 900, 2700]; // 25 min majoritaire
        $sessions = [];

        for ($i = 0; $i < $count; $i++) {
            // Biais vers les jours récents (les 10 derniers jours concentrent le gros)
            $daysAgo   = (int) floor((mt_rand(0, 1000) / 1000) ** 2 * 34);
            $endedAt   = $this->pastAt(now()->subDays($daysAgo)->setTime(mt_rand(7, 22), [0, 15, 30, 45][mt_rand(0, 3)]));
            $duration  = $durations[array_rand($durations)];
            $project   = (mt_rand(0, 100) < 80 && $projects) ? $projects[array_rand($projects)] : null;

            $session = new PomodoroSession([
                'user_id'          => $user->id,
                'project_id'       => $project?->id,
                'duration_seconds' => $duration,
                'started_at'       => (clone $endedAt)->subSeconds($duration),
                'ended_at'         => $endedAt,
                'is_declared'      => mt_rand(0, 100) < 15,
            ]);
            $session->created_at = $endedAt;
            $session->updated_at = $endedAt;
            $session->save();

            if ($categories && mt_rand(0, 100) < 60) {
                $picked = $this->pick($categories, mt_rand(1, 2));
                $session->categories()->attach(array_map(fn (Category $c) => $c->id, $picked));
            }

            $sessions[] = $session;
        }

        usort($sessions, fn ($a, $b) => $a->ended_at <=> $b->ended_at);

        return $sessions;
    }

    /** @param PomodoroSession[] $sessions */
    private function createTasks(User $user, array $sessions, string $volume): void
    {
        $count = match ($volume) {
            'gros'  => mt_rand(10, 15),
            'moyen' => mt_rand(7, 11),
            default => mt_rand(5, 8),
        };

        $titles = $this->pick($this->taskTitles, min($count, count($this->taskTitles)));
        $recentSessions = array_slice($sessions, -12);

        foreach ($titles as $title) {
            $createdAt = $this->pastAt(now()->subDays(mt_rand(0, 12))->setTime(mt_rand(8, 21), mt_rand(0, 59)));
            $done = mt_rand(0, 100) < 45;

            $task = new Task([
                'user_id'      => $user->id,
                'title'        => $title,
                'status'       => $done ? 'done' : 'pending',
                'completed_at' => null,
                'session_id'   => null,
            ]);

            if ($done) {
                $completedAt = (clone $createdAt)->addHours(mt_rand(1, 60));
                if ($completedAt->isFuture()) {
                    $completedAt = now()->subHours(mt_rand(1, 20));
                }
                $task->completed_at = $completedAt;
                if ($recentSessions && mt_rand(0, 100) < 70) {
                    $task->session_id = $recentSessions[array_rand($recentSessions)]->id;
                }
            }

            $task->created_at = $createdAt;
            $task->updated_at = $task->completed_at ?? $createdAt;
            $task->save();
        }
    }

    private function createGoals(User $user, array $projects): void
    {
        $daily = now()->subDays(mt_rand(5, 25));
        $goal = new UserGoal([
            'user_id'     => $user->id,
            'period_type' => 'daily',
            'target'      => mt_rand(3, 6),
            'project_id'  => null,
        ]);
        $goal->created_at = $daily;
        $goal->updated_at = $daily;
        $goal->save();

        $monthlyCreated = now()->subDays(mt_rand(3, 20));
        $monthlyGlobal = new UserGoal([
            'user_id'     => $user->id,
            'period_type' => 'monthly',
            'target'      => mt_rand(30, 80),
            'project_id'  => null,
        ]);
        $monthlyGlobal->created_at = $monthlyCreated;
        $monthlyGlobal->updated_at = $monthlyCreated;
        $monthlyGlobal->save();

        if ($projects && mt_rand(0, 1)) {
            $project = $projects[array_rand($projects)];
            $c = now()->subDays(mt_rand(2, 15));
            $goal = new UserGoal([
                'user_id'     => $user->id,
                'period_type' => 'monthly',
                'target'      => mt_rand(10, 30),
                'project_id'  => $project->id,
            ]);
            $goal->created_at = $c;
            $goal->updated_at = $c;
            $goal->save();
        }
    }

    private function createVictoryMessages(User $user, string $volume): void
    {
        $count = $volume === 'petit' ? mt_rand(0, 1) : mt_rand(1, 3);
        if ($count === 0) {
            return;
        }

        foreach ($this->pick($this->victoryMessages, $count) as $content) {
            $createdAt = $this->pastAt(now()->subDays(mt_rand(0, 14))->setTime(mt_rand(8, 22), mt_rand(0, 59)));
            $message = new VictoryMessage([
                'user_id' => $user->id,
                'content' => $content,
            ]);
            $message->created_at = $createdAt;
            $message->updated_at = $createdAt;
            $message->save();
        }
    }

    /**
     * Reconstitue un historique de points cohérent avec les sessions :
     * une ligne « pomodoro_base » par session + quelques bonus, puis
     * users.points = somme des point_events.
     *
     * @param PomodoroSession[] $sessions
     */
    private function awardPoints(User $user, array $sessions, string $volume): void
    {
        $rows = [];
        $n = 0;

        foreach ($sessions as $session) {
            $n++;
            $endedAt = $session->ended_at;

            $rows[] = $this->pointRow($user, 'pomodoro_base', 10, $endedAt, $session->id);

            // Bonus « premier pomodoro lié » sur la première session avec projet
            if ($n === 1 && $session->project_id) {
                $rows[] = $this->pointRow($user, 'first_linked_pomodoro', 75, $endedAt, $session->id);
            }

            // Bonus journalier / série / aléatoire simulé sur ~1 session sur 3
            $roll = mt_rand(0, 100);
            if ($roll < 12) {
                $rows[] = $this->pointRow($user, 'daily_first', 25, $endedAt, $session->id);
            } elseif ($roll < 22) {
                $rows[] = $this->pointRow($user, 'streak_days', 30, $endedAt, $session->id, ['days' => mt_rand(3, 9)]);
            } elseif ($roll < 30) {
                $rows[] = $this->pointRow($user, 'random_reward', mt_rand(5, 30), $endedAt, $session->id);
            }

            // Paliers sur le nombre total de pomodoros
            foreach ([1 => 100, 5 => 50, 10 => 75, 25 => 120, 50 => 200] as $threshold => $bonus) {
                if ($n === $threshold) {
                    $rows[] = $this->pointRow($user, "milestone_total_{$threshold}", $bonus, $endedAt, $session->id, ['count' => $n]);
                }
            }
        }

        if ($rows) {
            DB::table('point_events')->insert($rows);
        }

        $user->points = (int) array_sum(array_column($rows, 'points'));
        $user->save();
    }

    private function pointRow(User $user, string $key, int $points, Carbon $at, ?int $sessionId, ?array $meta = null): array
    {
        return [
            'user_id'    => $user->id,
            'event_key'  => $key,
            'points'     => $points,
            'meta'       => $meta ? json_encode($meta) : null,
            'session_id' => $sessionId,
            'created_at' => $at,
            'updated_at' => $at,
        ];
    }

    /** @param User[] $users */
    private function seedLikes(array $users): void
    {
        $messages = VictoryMessage::all();

        foreach ($messages as $message) {
            $likers = $this->pick(
                array_filter($users, fn (User $u) => $u->id !== $message->user_id),
                mt_rand(0, 4)
            );

            foreach ($likers as $liker) {
                $at = $this->pastAt(now()->subDays(mt_rand(0, 10))->setTime(mt_rand(8, 22), mt_rand(0, 59)));
                DB::table('message_likes')->insertOrIgnore([
                    'user_id'    => $liker->id,
                    'message_id' => $message->id,
                    'created_at' => $at,
                    'updated_at' => $at,
                ]);
            }
        }
    }

    /** Ramène une date dans le passé si le tirage aléatoire l'a placée dans le futur. */
    private function pastAt(Carbon $date): Carbon
    {
        return $date->isFuture() ? now()->subMinutes(mt_rand(5, 180)) : $date;
    }

    /**
     * Sous-ensemble aléatoire de $n éléments, sans doublon, ordre conservé.
     */
    private function pick(array $pool, int $n): array
    {
        $pool = array_values($pool);
        $n = max(0, min($n, count($pool)));
        if ($n === 0) {
            return [];
        }

        $keys = array_rand($pool, $n === 1 ? 1 : $n);
        $keys = is_array($keys) ? $keys : [$keys];
        sort($keys);

        return array_map(fn ($k) => $pool[$k], $keys);
    }
}
