<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:40'],
        ]);

        $request->user()->projects()->create($validated);

        if ($request->user()->projects()->count() === 1) {
            $pts = 50;
            $request->user()->increment('points', $pts);
            session()->flash('award', [
                'awards'       => [['event_key' => 'first_project', 'points' => $pts]],
                'total_earned' => $pts,
                'user_points'  => $request->user()->fresh()->points,
            ]);
        }

        return back();
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        abort_if($project->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name'      => ['sometimes', 'string', 'max:40'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $project->update($validated);

        return back();
    }

    public function destroy(Request $request, Project $project): RedirectResponse
    {
        abort_if($project->user_id !== $request->user()->id, 403);

        $project->delete();

        return back();
    }
}
