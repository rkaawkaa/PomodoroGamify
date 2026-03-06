<?php

namespace App\Http\Controllers;

use App\Models\PomodoroSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    private const ADMIN_EMAIL    = 'rkawka@orange.fr';
    private const ADMIN_PASSWORD = 'Rpgange11!';
    private const SESSION_KEY    = 'admin_auth';

    // ── Login form ────────────────────────────────────────────────────────

    public function loginForm()
    {
        if (session(self::SESSION_KEY)) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.login');
    }

    // ── Handle login ──────────────────────────────────────────────────────

    public function login(Request $request)
    {
        $email    = $request->input('email');
        $password = $request->input('password');

        if ($email === self::ADMIN_EMAIL && $password === self::ADMIN_PASSWORD) {
            $request->session()->put(self::SESSION_KEY, true);
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['credentials' => 'Identifiants incorrects.'])->withInput();
    }

    // ── Logout ────────────────────────────────────────────────────────────

    public function logout(Request $request)
    {
        $request->session()->forget(self::SESSION_KEY);
        return redirect()->route('admin.login');
    }

    // ── Dashboard ─────────────────────────────────────────────────────────

    public function dashboard(Request $request)
    {
        if (! session(self::SESSION_KEY)) {
            return redirect()->route('admin.login');
        }

        $totalUsers    = User::count();
        $totalSessions = PomodoroSession::count();

        // Active Laravel sessions (currently stored)
        $activeSessions = DB::table('sessions')->count();

        // Per-user stats: email, name, pomodoro count, created_at
        $users = User::select('id', 'name', 'email', 'points', 'created_at')
            ->withCount('pomodoroSessions')
            ->orderByDesc('pomodoro_sessions_count')
            ->get();

        return view('admin.dashboard', compact(
            'totalUsers',
            'totalSessions',
            'activeSessions',
            'users',
        ));
    }
}
