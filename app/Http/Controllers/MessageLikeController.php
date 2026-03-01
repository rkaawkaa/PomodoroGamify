<?php

namespace App\Http\Controllers;

use App\Models\MessageLike;
use App\Models\VictoryMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageLikeController extends Controller
{
    public function toggle(Request $request, VictoryMessage $victoryMessage): JsonResponse
    {
        $user = $request->user();

        // Cannot like own message
        abort_if($victoryMessage->user_id === $user->id, 403);

        $existing = MessageLike::where('user_id', $user->id)
            ->where('message_id', $victoryMessage->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            MessageLike::create([
                'user_id'    => $user->id,
                'message_id' => $victoryMessage->id,
            ]);
            $liked = true;
        }

        $count = $victoryMessage->likes()->count();

        return response()->json(['liked' => $liked, 'count' => $count]);
    }
}
