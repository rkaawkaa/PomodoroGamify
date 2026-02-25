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
