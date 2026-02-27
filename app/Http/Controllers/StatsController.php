<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $user      = $request->user();
        $projectId = $request->integer('project') ?: null;
        $categoryId = $request->integer('category') ?: null;
        $period    = in_array($request->string('period')->toString(), ['today', 'week', 'month', 'all'])
                     ? $request->string('period')->toString()
                     : 'all';
        $histPage  = max(1, (int) $request->query('history_page', 1));

        // ── Filtered query factory ──────────────────────────────────────────
        $makeQuery = fn () => $user->pomodoroSessions()
            ->whereNotNull('ended_at')
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->when(
                $categoryId,
                fn ($q) => $q->whereHas('categories', fn ($q2) => $q2->where('categories.id', $categoryId))
            )
            ->when($period === 'today', fn ($q) => $q->whereDate('ended_at', today()))
            ->when($period === 'week', fn ($q) => $q->whereBetween('ended_at', [now()->startOfWeek(), now()->endOfWeek()]))
            ->when($period === 'month', fn ($q) => $q->where('ended_at', '>=', now()->startOfMonth()));

        // ── Overview KPIs ───────────────────────────────────────────────────
        $totalSessions = $makeQuery()->count();
        $totalSeconds  = (int) $makeQuery()->sum('duration_seconds');

        // ── Streaks (always all-time, ignores project/category/period) ──────
        ['current' => $currentStreak, 'best' => $bestStreak] = $this->calculateStreaks($user);

        // ── Daily average (filtered) ────────────────────────────────────────
        $dailyAvg = $this->getDailyAvg($makeQuery);

        // ── Charts (project/category filtered, fixed window) ────────────────
        $dailyChart  = $this->getDailyChart($user, $projectId, $categoryId);
        $weeklyChart = $this->getWeeklyChart($user, $projectId, $categoryId);

        // ── History (paginated, filtered) ───────────────────────────────────
        $history = $makeQuery()
            ->with(['project:id,name', 'categories:id,name'])
            ->withCount('tasks')
            ->orderBy('ended_at', 'desc')
            ->paginate(15, ['*'], 'history_page')
            ->through(fn ($s) => [
                'id'               => $s->id,
                'ended_at'         => $s->ended_at->toIso8601String(),
                'duration_seconds' => $s->duration_seconds,
                'project'          => $s->project ? ['id' => $s->project->id, 'name' => $s->project->name] : null,
                'categories'       => $s->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values(),
                'tasks_count'      => $s->tasks_count,
            ]);

        // ── Leaderboard (global, not filtered) ──────────────────────────────
        $leaderboard = $this->getLeaderboard();

        return Inertia::render('Stats', [
            'filters'    => ['project' => $projectId, 'category' => $categoryId, 'period' => $period],
            'projects'   => $user->projects()->orderBy('name')->get(['id', 'name'])->values(),
            'categories' => $user->categories()->orderBy('name')->get(['id', 'name'])->values(),
            'overview'   => [
                'total_sessions' => $totalSessions,
                'total_seconds'  => $totalSeconds,
                'current_streak' => $currentStreak,
                'best_streak'    => $bestStreak,
                'daily_avg'      => $dailyAvg,
            ],
            'dailyChart'  => $dailyChart,
            'weeklyChart' => $weeklyChart,
            'history'     => $history,
            'leaderboard' => $leaderboard,
            'userPoints'  => $user->points,
            'userId'      => $user->id,
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function calculateStreaks(User $user): array
    {
        $dates = $user->pomodoroSessions()
            ->whereNotNull('ended_at')
            ->selectRaw('DATE(ended_at) as day')
            ->groupBy('day')
            ->orderBy('day', 'desc')
            ->pluck('day')
            ->map(fn ($d) => Carbon::parse($d)->startOfDay());

        if ($dates->isEmpty()) {
            return ['current' => 0, 'best' => 0];
        }

        // Current streak: most-recent date must be today or yesterday
        $current    = 0;
        $firstDate  = $dates->first();
        $yesterday  = Carbon::yesterday()->startOfDay();

        if ($firstDate->gte($yesterday)) {
            $expected = $firstDate->copy();
            foreach ($dates as $date) {
                if ($date->eq($expected)) {
                    $current++;
                    $expected->subDay();
                } else {
                    break;
                }
            }
        }

        // Best streak: scan ascending
        $ascending = $dates->sortBy(fn ($d) => $d->timestamp)->values();
        $best = 1;
        $run  = 1;
        for ($i = 1; $i < $ascending->count(); $i++) {
            if ($ascending[$i]->eq($ascending[$i - 1]->copy()->addDay())) {
                $run++;
                $best = max($best, $run);
            } else {
                $run = 1;
            }
        }

        return ['current' => $current, 'best' => max($best, $current)];
    }

    private function getDailyAvg(\Closure $makeQuery): float
    {
        $rows = $makeQuery()
            ->selectRaw('DATE(ended_at) as day, COUNT(*) as cnt')
            ->groupBy('day')
            ->pluck('cnt');

        return $rows->isEmpty() ? 0.0 : round($rows->avg(), 1);
    }

    private function getDailyChart(User $user, ?int $projectId, ?int $categoryId): array
    {
        $rangeStart = now()->subDays(13)->startOfDay();

        $rows = $user->pomodoroSessions()
            ->whereNotNull('ended_at')
            ->where('ended_at', '>=', $rangeStart)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->when(
                $categoryId,
                fn ($q) => $q->whereHas('categories', fn ($q2) => $q2->where('categories.id', $categoryId))
            )
            ->selectRaw('DATE(ended_at) as day, COUNT(*) as cnt')
            ->groupBy('day')
            ->pluck('cnt', 'day');

        return collect(range(13, 0))
            ->map(fn ($i) => now()->subDays($i)->format('Y-m-d'))
            ->map(fn ($d) => [
                'label'    => Carbon::parse($d)->format('M d'),
                'date'     => $d,
                'sessions' => (int) ($rows[$d] ?? 0),
                'today'    => $d === now()->format('Y-m-d'),
            ])
            ->values()
            ->toArray();
    }

    private function getWeeklyChart(User $user, ?int $projectId, ?int $categoryId): array
    {
        $rangeStart = now()->subWeeks(7)->startOfWeek()->startOfDay();

        $rows = $user->pomodoroSessions()
            ->whereNotNull('ended_at')
            ->where('ended_at', '>=', $rangeStart)
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->when(
                $categoryId,
                fn ($q) => $q->whereHas('categories', fn ($q2) => $q2->where('categories.id', $categoryId))
            )
            ->selectRaw('DATE(ended_at) as day, COUNT(*) as cnt')
            ->groupBy('day')
            ->pluck('cnt', 'day');

        $currentWeekStart = now()->startOfWeek()->format('Y-m-d');

        return collect(range(7, 0))->map(function ($i) use ($rows, $currentWeekStart) {
            $weekStart = now()->subWeeks($i)->startOfWeek();
            $cnt = 0;
            $cursor = $weekStart->copy();
            for ($j = 0; $j < 7; $j++) {
                $cnt += (int) ($rows[$cursor->format('Y-m-d')] ?? 0);
                $cursor->addDay();
            }
            return [
                'label'    => $weekStart->format('M d'),
                'sessions' => $cnt,
                'current'  => $weekStart->format('Y-m-d') === $currentWeekStart,
            ];
        })->values()->toArray();
    }

    private function getLeaderboard(): array
    {
        $weekStart  = now()->startOfWeek();
        $weekEnd    = now()->endOfWeek();
        $monthStart = now()->startOfMonth();
        $monthEnd   = now()->endOfMonth();

        $buildRanking = fn ($from, $to) => DB::table('pomodoro_sessions')
            ->join('users', 'users.id', '=', 'pomodoro_sessions.user_id')
            ->whereBetween('pomodoro_sessions.ended_at', [$from, $to])
            ->whereNotNull('pomodoro_sessions.ended_at')
            ->select(
                'users.id',
                'users.name',
                'users.points',
                DB::raw('COUNT(*) as sessions')
            )
            ->groupBy('users.id', 'users.name', 'users.points')
            ->orderByDesc('sessions')
            ->limit(50)
            ->get()
            ->values()
            ->toArray();

        return [
            'weekly'  => $buildRanking($weekStart, $weekEnd),
            'monthly' => $buildRanking($monthStart, $monthEnd),
        ];
    }
}
