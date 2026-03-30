<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RecapMailService
{
    /**
     * Compute all stats for a given user over a date range.
     *
     * @return array{
     *   total_sessions: int,
     *   total_seconds: int,
     *   total_hours: float,
     *   by_project: Collection,
     *   by_category: Collection,
     *   best_day: object|null,
     *   active_days: int,
     *   period_from: Carbon,
     *   period_to: Carbon,
     * }
     */
    public function stats(User $user, Carbon $from, Carbon $to): array
    {
        $base = fn () => DB::table('pomodoro_sessions')
            ->where('user_id', $user->id)
            ->whereNotNull('ended_at')
            ->whereBetween('ended_at', [$from, $to]);

        $totalSessions = (clone $base())->count();
        $totalSeconds  = (int) (clone $base())->sum('duration_seconds');

        // Active days (days with at least one session)
        $activeDays = (clone $base())
            ->selectRaw('DATE(ended_at) as day')
            ->groupBy('day')
            ->get()
            ->count();

        // By project (top 5)
        $byProject = DB::table('pomodoro_sessions')
            ->join('projects', 'projects.id', '=', 'pomodoro_sessions.project_id')
            ->where('pomodoro_sessions.user_id', $user->id)
            ->whereNotNull('pomodoro_sessions.ended_at')
            ->whereNotNull('pomodoro_sessions.project_id')
            ->whereBetween('pomodoro_sessions.ended_at', [$from, $to])
            ->select(
                'projects.name',
                DB::raw('COUNT(*) as sessions'),
                DB::raw('SUM(pomodoro_sessions.duration_seconds) as seconds')
            )
            ->groupBy('projects.id', 'projects.name')
            ->orderByDesc('sessions')
            ->limit(5)
            ->get();

        // By category (top 5)
        $byCategory = DB::table('pomodoro_sessions')
            ->join('category_pomodoro_session', 'pomodoro_sessions.id', '=', 'category_pomodoro_session.pomodoro_session_id')
            ->join('categories', 'categories.id', '=', 'category_pomodoro_session.category_id')
            ->where('pomodoro_sessions.user_id', $user->id)
            ->whereNotNull('pomodoro_sessions.ended_at')
            ->whereBetween('pomodoro_sessions.ended_at', [$from, $to])
            ->select(
                'categories.name',
                DB::raw('COUNT(*) as sessions'),
                DB::raw('SUM(pomodoro_sessions.duration_seconds) as seconds')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('sessions')
            ->limit(5)
            ->get();

        // Best day in period
        $bestDay = (clone $base())
            ->selectRaw('DATE(ended_at) as day, COUNT(*) as cnt, SUM(duration_seconds) as seconds')
            ->groupBy('day')
            ->orderByDesc('cnt')
            ->first();

        return [
            'total_sessions' => $totalSessions,
            'total_seconds'  => $totalSeconds,
            'total_hours'    => round($totalSeconds / 3600, 1),
            'by_project'     => $byProject,
            'by_category'    => $byCategory,
            'best_day'       => $bestDay,
            'active_days'    => $activeDays,
            'period_from'    => $from,
            'period_to'      => $to,
        ];
    }

    /** Format seconds as "Xh Ym" */
    public static function fmtSeconds(int $s): string
    {
        $h = (int) floor($s / 3600);
        $m = (int) floor(($s % 3600) / 60);
        if ($h > 0 && $m > 0) return "{$h}h {$m}min";
        if ($h > 0) return "{$h}h";
        return "{$m}min";
    }

    /** Pick a random encouragement phrase */
    public static function encouragement(string $locale): string
    {
        $phrases = $locale === 'fr' ? [
            'La régularité est la clé. Chaque session compte.',
            'Tu avances. Pas à pas, la forêt pousse.',
            'Le focus est un muscle. Tu t\'entraînes.',
            'Bravo pour ta constance — continue sur cette lancée !',
            'Chaque pomodoro planté est une graine de succès.',
            'La discipline d\'aujourd\'hui est la récompense de demain.',
            'Tu construis quelque chose de grand, session après session.',
        ] : [
            'Consistency is the key. Every session counts.',
            'Step by step, the forest grows.',
            'Focus is a muscle. You\'re training it.',
            'Great consistency — keep it up!',
            'Every pomodoro planted is a seed of success.',
            'Today\'s discipline is tomorrow\'s reward.',
            'You\'re building something great, session by session.',
        ];

        return $phrases[array_rand($phrases)];
    }
}
