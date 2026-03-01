<?php

namespace App\Http\Controllers;

use App\Models\MessageLike;
use App\Models\VictoryMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VictoryMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $messages = VictoryMessage::query()
            ->with('user:id,name')
            ->withCount('likes')
            ->where('created_at', '>=', now()->subHours(48))
            ->orderByDesc('likes_count')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(function (VictoryMessage $msg) use ($userId) {
                return [
                    'id'         => $msg->id,
                    'content'    => $msg->content,
                    'user'       => $msg->user,
                    'likes_count' => $msg->likes_count,
                    'user_liked' => MessageLike::where('user_id', $userId)
                        ->where('message_id', $msg->id)
                        ->exists(),
                    'created_at' => $msg->created_at,
                ];
            });

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content' => ['required', 'string', 'max:280'],
        ]);

        $user = $request->user();

        // Spam protection: max 5 messages per 24h
        $recentCount = VictoryMessage::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subHours(24))
            ->count();

        if ($recentCount >= 5) {
            return response()->json(['message' => 'Daily limit reached.'], 422);
        }

        $msg = VictoryMessage::create([
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        $msg->load('user:id,name');

        return response()->json([
            'id'          => $msg->id,
            'content'     => $msg->content,
            'user'        => $msg->user,
            'likes_count' => 0,
            'user_liked'  => false,
            'created_at'  => $msg->created_at,
        ], 201);
    }

    public function destroy(Request $request, VictoryMessage $victoryMessage): JsonResponse
    {
        abort_if($victoryMessage->user_id !== $request->user()->id, 403);

        $victoryMessage->delete();

        return response()->json(null, 204);
    }
}
