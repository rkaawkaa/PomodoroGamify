<?php

namespace App\Services;

use App\Models\PomodoroSession;
use App\Models\User;
use App\Points\PointRules;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PointService
{
    // ─── Public API ──────────────────────────────────────────────────────────

    /**
     * Award points for a completed pomodoro session.
     *
     * Must be called AFTER the session (and its category associations) have been
     * persisted, so that count/sum queries include the new session.
     *
     * @param  int[]  $categoryIds  Category IDs attached to this session.
     * @return array<int, array{event_key: string, points: int, meta: array|null}>
     */
    public function awardPomodoro(User $user, PomodoroSession $session, array $categoryIds): array
    {
        $awards = [];

        // 1. Base points — always
        $awards[] = $this->award('pomodoro_base', PointRules::POMODORO_BASE);

        // 2. Daily count bonuses (fixed: 1st, 4th)
        $todayCount = $this->todayPomodoroCount($user);

        if (isset(PointRules::DAILY_COUNT_BONUSES[$todayCount])) {
            $key = $todayCount === 1 ? 'daily_first' : "daily_{$todayCount}th";
            $awards[] = $this->award($key, PointRules::DAILY_COUNT_BONUSES[$todayCount]);
        }

        // 3. Scaling bonus from Nth pomodoro of the day
        if ($todayCount >= PointRules::DAILY_SCALING_START) {
            $extra  = $todayCount - PointRules::DAILY_SCALING_START; // 0-based offset
            $bonus  = PointRules::DAILY_SCALING_BASE + $extra * PointRules::DAILY_SCALING_INCREMENT;
            $awards[] = $this->award('daily_scaling', $bonus, ['n' => $todayCount]);
        }

        // 4. Consecutive-day streak
        $streak = $this->computeStreak($user);
        if ($streak >= PointRules::STREAK_MIN_DAYS) {
            $awards[] = $this->award('streak_days', PointRules::STREAK_BONUS, ['days' => $streak]);
        }

        // 5. All-time total milestone (pomodoros)
        $total = $this->totalPomodoroCount($user);
        foreach (PointRules::MILESTONES_TOTAL_POMODOROS as $threshold => $bonus) {
            if ($total === $threshold) {
                $awards[] = $this->award("milestone_total_{$threshold}", $bonus, ['count' => $total]);
            }
        }

        // 6. Per-project milestone (pomodoros)
        if ($session->project_id) {
            $projCount = $this->projectPomodoroCount($user, $session->project_id);
            foreach (PointRules::MILESTONES_SCOPED_POMODOROS as $threshold => $bonus) {
                if ($projCount === $threshold) {
                    $awards[] = $this->award("milestone_project_{$threshold}", $bonus, ['project_id' => $session->project_id]);
                }
            }
        }

        // 7. Per-category milestones (pomodoros)
        foreach ($categoryIds as $catId) {
            $catCount = $this->categoryPomodoroCount($user, $catId);
            foreach (PointRules::MILESTONES_SCOPED_POMODOROS as $threshold => $bonus) {
                if ($catCount === $threshold) {
                    $awards[] = $this->award("milestone_category_{$threshold}", $bonus, ['category_id' => $catId]);
                }
            }
        }

        // 8. All-time focus-hour milestones
        $totalSec = $this->totalPomodoroSeconds($user);
        $prevSec  = $totalSec - $session->duration_seconds;
        foreach (PointRules::MILESTONES_TOTAL_HOURS as $hours => $bonus) {
            $threshold = $hours * 3600;
            if ($prevSec < $threshold && $totalSec >= $threshold) {
                $awards[] = $this->award("milestone_hours_{$hours}", $bonus, ['hours' => $hours]);
            }
        }

        // 9. Per-project focus-hour milestones
        if ($session->project_id) {
            $projSec  = $this->projectPomodoroSeconds($user, $session->project_id);
            $prevProj = $projSec - $session->duration_seconds;
            foreach (PointRules::MILESTONES_SCOPED_HOURS as $hours => $bonus) {
                $threshold = $hours * 3600;
                if ($prevProj < $threshold && $projSec >= $threshold) {
                    $awards[] = $this->award("milestone_project_hours_{$hours}", $bonus, ['hours' => $hours, 'project_id' => $session->project_id]);
                }
            }
        }

        // 10. Per-category focus-hour milestones
        foreach ($categoryIds as $catId) {
            $catSec  = $this->categoryPomodoroSeconds($user, $catId);
            $prevCat = $catSec - $session->duration_seconds;
            foreach (PointRules::MILESTONES_SCOPED_HOURS as $hours => $bonus) {
                $threshold = $hours * 3600;
                if ($prevCat < $threshold && $catSec >= $threshold) {
                    $awards[] = $this->award("milestone_category_hours_{$hours}", $bonus, ['hours' => $hours, 'category_id' => $catId]);
                }
            }
        }

        // 11. Random bonus
        if ((mt_rand(1, 100) / 100) <= PointRules::RANDOM_CHANCE) {
            $bonus = mt_rand(PointRules::RANDOM_MIN, PointRules::RANDOM_MAX);
            $awards[] = $this->award('random_reward', $bonus);
        }

        $this->persist($user, $awards, $session->id);

        return $awards;
    }

    /**
     * Award points for a task completion.
     * Call this after the task has been saved as 'done'.
     *
     * @return array<int, array{event_key: string, points: int, meta: array|null}>
     */
    public function awardTask(User $user): array
    {
        $todayDone = (int) $user->tasks()
            ->where('status', 'done')
            ->whereDate('completed_at', today())
            ->count();

        $awards = [];
        foreach (PointRules::TASK_DAILY_BONUSES as $threshold => $bonus) {
            if ($todayDone === $threshold) {
                $awards[] = $this->award("task_daily_{$threshold}", $bonus, ['count' => $todayDone]);
            }
        }

        if (!empty($awards)) {
            $this->persist($user, $awards);
        }

        return $awards;
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private function award(string $eventKey, int $points, ?array $meta = null): array
    {
        return ['event_key' => $eventKey, 'points' => $points, 'meta' => $meta];
    }

    private function persist(User $user, array $awards, ?int $sessionId = null): void
    {
        if (empty($awards)) return;

        $total = array_sum(array_column($awards, 'points'));
        $now   = now();

        $rows = array_map(fn($a) => [
            'user_id'    => $user->id,
            'event_key'  => $a['event_key'],
            'points'     => $a['points'],
            'meta'       => isset($a['meta']) ? json_encode($a['meta']) : null,
            'session_id' => $sessionId,
            'created_at' => $now,
            'updated_at' => $now,
        ], $awards);

        DB::table('point_events')->insert($rows);
        $user->increment('points', $total);
    }

    // ─── DB queries ──────────────────────────────────────────────────────────

    private function todayPomodoroCount(User $user): int
    {
        return $user->pomodoroSessions()->whereDate('ended_at', today())->count();
    }

    private function totalPomodoroCount(User $user): int
    {
        return $user->pomodoroSessions()->count();
    }

    private function projectPomodoroCount(User $user, int $projectId): int
    {
        return $user->pomodoroSessions()->where('project_id', $projectId)->count();
    }

    private function categoryPomodoroCount(User $user, int $categoryId): int
    {
        return (int) DB::table('pomodoro_sessions')
            ->join('category_pomodoro_session', 'pomodoro_sessions.id', '=', 'category_pomodoro_session.pomodoro_session_id')
            ->where('pomodoro_sessions.user_id', $user->id)
            ->where('category_pomodoro_session.category_id', $categoryId)
            ->count();
    }

    private function totalPomodoroSeconds(User $user): int
    {
        return (int) $user->pomodoroSessions()->sum('duration_seconds');
    }

    private function projectPomodoroSeconds(User $user, int $projectId): int
    {
        return (int) $user->pomodoroSessions()->where('project_id', $projectId)->sum('duration_seconds');
    }

    private function categoryPomodoroSeconds(User $user, int $categoryId): int
    {
        return (int) DB::table('pomodoro_sessions')
            ->join('category_pomodoro_session', 'pomodoro_sessions.id', '=', 'category_pomodoro_session.pomodoro_session_id')
            ->where('pomodoro_sessions.user_id', $user->id)
            ->where('category_pomodoro_session.category_id', $categoryId)
            ->sum('pomodoro_sessions.duration_seconds');
    }

    /**
     * Count the number of consecutive calendar days (ending today) where
     * the user has at least one completed pomodoro.
     */
    private function computeStreak(User $user): int
    {
        $dates = DB::table('pomodoro_sessions')
            ->where('user_id', $user->id)
            ->selectRaw('DATE(ended_at) as d')
            ->distinct()
            ->orderByRaw('DATE(ended_at) DESC')
            ->pluck('d');

        if ($dates->isEmpty()) return 0;

        // The most recent date must be today (current session was just saved)
        if ($dates[0] !== Carbon::today()->toDateString()) return 1;

        $streak   = 1;
        $expected = Carbon::today()->subDay();

        foreach ($dates->slice(1) as $date) {
            if ($date === $expected->toDateString()) {
                $streak++;
                $expected->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}
