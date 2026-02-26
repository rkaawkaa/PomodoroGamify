<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PomodoroSessionController extends Controller
{
    public function store(Request $request)
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
        ]);

        $session = $user->pomodoroSessions()->create([
            'project_id'       => $data['project_id'] ?? null,
            'duration_seconds' => $data['duration_seconds'],
            'ended_at'         => now(),
        ]);

        if (!empty($data['category_ids'])) {
            $session->categories()->attach($data['category_ids']);
        }

        if (!empty($data['completed_task_ids'])) {
            $user->tasks()
                ->whereIn('id', $data['completed_task_ids'])
                ->whereNull('session_id')
                ->update(['session_id' => $session->id]);
        }

        return response()->json(['id' => $session->id], 201);
    }
}
