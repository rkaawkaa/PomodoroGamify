<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = $request->user()->tasks()->create([
            'title'  => $data['title'],
            'status' => 'pending',
        ]);

        return response()->json([
            'id'           => $task->id,
            'title'        => $task->title,
            'status'       => 'pending',
            'completed_at' => null,
            'session_id'   => null,
        ], 201);
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        abort_if($task->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'title'  => 'sometimes|string|max:255',
            'status' => 'sometimes|in:pending,done',
        ]);

        if (isset($data['status'])) {
            if ($data['status'] === 'done' && $task->status !== 'done') {
                $task->completed_at = now();
            } elseif ($data['status'] === 'pending') {
                $task->completed_at = null;
            }
        }

        $task->fill($data)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        abort_if($task->user_id !== $request->user()->id, 403);

        $task->delete();

        return response()->json(['ok' => true]);
    }
}
