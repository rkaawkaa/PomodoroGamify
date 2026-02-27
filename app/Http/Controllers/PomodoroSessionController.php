<?php

namespace App\Http\Controllers;

use App\Services\PointService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PomodoroSessionController extends Controller
{
    public function store(Request $request, PointService $points)
    {
        $user = $request->user();

        $data = $request->validate([
            'project_id' => [
                'nullable',
                Rule::exists('projects', 'id')->where('user_id', $user->id),
            ],
            'category_ids'        => 'array',
            'category_ids.*'      => [Rule::exists('categories', 'id')->where('user_id', $user->id)],
            'completed_task_ids'  => 'array',
            'completed_task_ids.*'=> ['integer', Rule::exists('tasks', 'id')->where('user_id', $user->id)],
            'duration_seconds'    => 'required|integer|min:1',
            'started_at'          => 'nullable|date',
        ]);

        $session = $user->pomodoroSessions()->create([
            'project_id'       => $data['project_id'] ?? null,
            'duration_seconds' => $data['duration_seconds'],
            'started_at'       => $data['started_at'] ?? null,
            'ended_at'         => now(),
        ]);

        $categoryIds = $data['category_ids'] ?? [];

        if (!empty($categoryIds)) {
            $session->categories()->attach($categoryIds);
        }

        if (!empty($data['completed_task_ids'])) {
            $user->tasks()
                ->whereIn('id', $data['completed_task_ids'])
                ->whereNull('session_id')
                ->update(['session_id' => $session->id]);
        }

        // Award points (queries run after session + categories are persisted)
        $awards = $points->awardPomodoro($user, $session, $categoryIds);

        $totalEarned = array_sum(array_column($awards, 'points'));

        return response()->json([
            'id'           => $session->id,
            'awards'       => $awards,
            'total_earned' => $totalEarned,
            'user_points'  => $user->fresh()->points,
        ], 201);
    }
}
