<?php

namespace App\Http\Controllers;

use App\Services\PointService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DeclaredSessionController extends Controller
{
    public function store(Request $request, PointService $points)
    {
        $user = $request->user();

        $data = $request->validate([
            'worked_at'        => 'required|date|before_or_equal:now',
            'duration_minutes' => 'required|integer|min:1|max:600',
            'project_id'       => [
                'nullable',
                Rule::exists('projects', 'id')->where('user_id', $user->id),
            ],
            'category_ids'    => 'array',
            'category_ids.*'  => [Rule::exists('categories', 'id')->where('user_id', $user->id)],
        ]);

        $endedAt   = Carbon::parse($data['worked_at']);
        $durationS = $data['duration_minutes'] * 60;
        $startedAt = $endedAt->copy()->subSeconds($durationS);

        $session = $user->pomodoroSessions()->create([
            'project_id'       => $data['project_id'] ?? null,
            'duration_seconds' => $durationS,
            'started_at'       => $startedAt,
            'ended_at'         => $endedAt,
            'is_declared'      => true,
        ]);

        $categoryIds = $data['category_ids'] ?? [];
        if (!empty($categoryIds)) {
            $session->categories()->attach($categoryIds);
        }

        // Award points — milestone bonuses naturally apply since the session is persisted.
        // Daily bonuses only trigger if ended_at is today (the DB query filters by today's date).
        // Streak bonuses use the actual ended_at date so past sessions fill real gaps correctly.
        $awards = $points->awardPomodoro($user, $session, $categoryIds);

        $totalEarned = array_sum(array_column($awards, 'points'));

        return response()->json([
            'session_id'   => $session->id,
            'ended_at'     => $endedAt->toIso8601String(),
            'awards'       => $awards,
            'total_earned' => $totalEarned,
            'user_points'  => $user->fresh()->points,
        ], 201);
    }
}
