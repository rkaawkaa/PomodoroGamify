<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PomodoroSettingsController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'pomodoro_duration'    => ['required', 'integer', 'min:2', 'max:300'],
            'break_duration'       => ['required', 'integer', 'min:1', 'max:120'],
            'auto_start_breaks'    => ['required', 'boolean'],
            'auto_start_pomodoros' => ['required', 'boolean'],
        ]);

        $request->user()->update($request->only([
            'pomodoro_duration',
            'break_duration',
            'auto_start_breaks',
            'auto_start_pomodoros',
        ]));

        return back();
    }
}
