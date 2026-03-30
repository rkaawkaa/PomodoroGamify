<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Recap emails ──────────────────────────────────────────────────────────────

// Weekly recap — every Sunday at 19:00
Schedule::command('recap:send weekly')
    ->weeklyOn(0, '19:00')
    ->withoutOverlapping()
    ->runInBackground();

// Monthly recap — last day of each month at 18:00
Schedule::command('recap:send monthly')
    ->lastDayOfMonth('18:00')
    ->withoutOverlapping()
    ->runInBackground();

// Yearly recap — December 31 at 18:00
Schedule::command('recap:send yearly')
    ->cron('0 18 31 12 *')
    ->withoutOverlapping()
    ->runInBackground();
