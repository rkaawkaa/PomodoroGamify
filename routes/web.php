<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PomodoroSessionController;
use App\Http\Controllers\PomodoroSettingsController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function (Request $request) {
    $user = $request->user();
    return Inertia::render('Dashboard', [
        'pomodoroSettings' => [
            'pomodoro_duration'    => $user->pomodoro_duration,
            'break_duration'       => $user->break_duration,
            'auto_start_breaks'    => $user->auto_start_breaks,
            'auto_start_pomodoros' => $user->auto_start_pomodoros,
        ],
        'projects'   => $user->projects()->orderBy('name')->get(['id', 'name', 'is_active'])->values(),
        'categories' => $user->categories()->orderBy('name')->get(['id', 'name', 'is_active'])->values(),
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
});

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

require __DIR__.'/auth.php';
