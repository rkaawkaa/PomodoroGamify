<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GoalController extends Controller
{
    /**
     * Upsert a goal. One daily goal per user (project_id ignored for daily).
     * One monthly goal per user per project_id (null = global).
     */
    public function upsert(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'period_type' => ['required', Rule::in(['daily', 'monthly'])],
            'target'      => 'required|integer|min:1|max:9999',
            'project_id'  => [
                'nullable',
                Rule::exists('projects', 'id')->where('user_id', $user->id),
            ],
        ]);

        $match = [
            'user_id'     => $user->id,
            'period_type' => $data['period_type'],
            'project_id'  => $data['period_type'] === 'daily' ? null : ($data['project_id'] ?? null),
        ];

        $goal = $user->goals()->updateOrCreate($match, [
            'target' => $data['target'],
        ]);

        return response()->json(['id' => $goal->id], 200);
    }

    /**
     * Delete a goal by id (must belong to the authenticated user).
     */
    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        $user->goals()->where('id', $id)->delete();
        return response()->json(null, 204);
    }
}
