<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PomodoroSessionController;
use App\Http\Controllers\PomodoroSettingsController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function (Request $request) {
    $user = $request->user();

    // Today's completed pomodoro count
    $todayCount = $user->pomodoroSessions()
        ->whereDate('ended_at', today())
        ->count();

    // This month's completed pomodoros grouped by project_id (0 = no project / global)
    $monthRows = $user->pomodoroSessions()
        ->whereYear('ended_at', now()->year)
        ->whereMonth('ended_at', now()->month)
        ->selectRaw('COALESCE(project_id, 0) as proj_id, COUNT(*) as cnt')
        ->groupBy('project_id')
        ->pluck('cnt', 'proj_id');

    // Total for the month (all projects combined)
    $monthTotal = $monthRows->sum();

    // Per-project counts keyed by project_id (string keys for JSON)
    $monthCounts = $monthRows->mapWithKeys(fn ($cnt, $projId) => [(string) $projId => (int) $cnt]);

    return Inertia::render('Dashboard', [
        'pomodoroSettings' => [
            'pomodoro_duration'    => $user->pomodoro_duration,
            'break_duration'       => $user->break_duration,
            'auto_start_breaks'    => $user->auto_start_breaks,
            'auto_start_pomodoros' => $user->auto_start_pomodoros,
        ],
        'projects'   => $user->projects()->orderBy('name')->get(['id', 'name', 'is_active'])->values(),
        'categories' => $user->categories()->orderBy('name')->get(['id', 'name', 'is_active'])->values(),
        'tasks'      => $user->tasks()
            ->where(function ($q) {
                $q->where('status', 'pending')
                  ->orWhere('completed_at', '>=', now()->startOfDay());
            })
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title', 'status', 'completed_at', 'session_id'])
            ->values(),
        'goals'       => $user->goals()->with('project:id,name')->get(['id', 'period_type', 'target', 'project_id'])->values(),
        'todayCount'  => $todayCount,
        'monthTotal'  => $monthTotal,
        'monthCounts' => $monthCounts,
        'userPoints'  => $user->points,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::patch('/settings/pomodoro', [PomodoroSettingsController::class, 'update'])->name('settings.pomodoro');

    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/pomodoro-sessions', [PomodoroSessionController::class, 'store'])->name('pomodoro-sessions.store');

    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    Route::post('/goals', [GoalController::class, 'upsert'])->name('goals.upsert');
    Route::delete('/goals/{id}', [GoalController::class, 'destroy'])->name('goals.destroy');

    Route::get('/player-profile', function (Request $request) {
        return Inertia::render('PlayerProfile', [
            'userPoints' => $request->user()->points,
        ]);
    })->name('player-profile');

    Route::get('/stats', [StatsController::class, 'index'])->name('stats');
});

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

require __DIR__.'/auth.php';
