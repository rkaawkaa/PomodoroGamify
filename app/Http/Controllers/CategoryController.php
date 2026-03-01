<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:40'],
        ]);

        $request->user()->categories()->create($validated);

        if ($request->user()->categories()->count() === 1) {
            $pts = 50;
            $request->user()->increment('points', $pts);
            session()->flash('award', [
                'awards'       => [['event_key' => 'first_category', 'points' => $pts]],
                'total_earned' => $pts,
                'user_points'  => $request->user()->fresh()->points,
            ]);
        }

        return back();
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name'      => ['sometimes', 'string', 'max:40'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $category->update($validated);

        return back();
    }

    public function destroy(Request $request, Category $category): RedirectResponse
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        $category->delete();

        return back();
    }
}
