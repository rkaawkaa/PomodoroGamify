<?php

namespace App\Points;

/**
 * Centralized point rule configuration.
 *
 * All values here are in POINTS unless stated otherwise.
 * Edit this file to tune the economy without touching business logic.
 */
final class PointRules
{
    // ─── Base ────────────────────────────────────────────────────────────────

    /** Points awarded for every completed pomodoro (always). */
    const POMODORO_BASE = 10;

    // ─── Daily streak bonuses (within the same calendar day) ─────────────────

    /**
     * Fixed bonuses for specific daily pomodoro counts.
     * Key = the Nth pomodoro that day, value = bonus points.
     */
    const DAILY_COUNT_BONUSES = [
        1 => 25,  // 1st pomodoro of the day
        4 => 40,  // 4th pomodoro of the day
    ];

    /**
     * From this Nth pomodoro of the day onwards, a scaling bonus kicks in.
     * Bonus = DAILY_SCALING_BASE + (n - DAILY_SCALING_START) * DAILY_SCALING_INCREMENT
     * where n = today's pomodoro count.
     */
    const DAILY_SCALING_START     = 6;  // starts at the 6th pomodoro
    const DAILY_SCALING_BASE      = 5;  // 5 pts for the 6th
    const DAILY_SCALING_INCREMENT = 5;  // +5 more for each additional one

    // ─── Consecutive-day streak ───────────────────────────────────────────────

    /** Minimum consecutive days needed to trigger the streak bonus. */
    const STREAK_MIN_DAYS = 3;

    /** Bonus awarded per session when the user has a streak >= STREAK_MIN_DAYS. */
    const STREAK_BONUS = 30;

    // ─── Task bonuses (daily count thresholds) ────────────────────────────────

    /**
     * Bonus when the user completes their Nth task of the day.
     * Key = N, value = bonus points.
     */
    const TASK_DAILY_BONUSES = [
        1  => 20,
        5  => 50,
        10 => 100,
    ];

    // ─── Milestone: total pomodoros ever ─────────────────────────────────────

    /**
     * One-time bonuses when the user's all-time pomodoro count hits these values.
     * Key = count threshold, value = bonus points.
     */
    const MILESTONES_TOTAL_POMODOROS = [
        1     => 100,   // very first pomodoro — onboarding
        5     => 50,
        10    => 75,
        100   => 200,
        1000  => 500,
        10000 => 1000,
    ];

    // ─── Milestone: pomodoros per project / per category ─────────────────────

    /**
     * Bonuses when pomodoros for a specific project or category hit these values.
     */
    const MILESTONES_SCOPED_POMODOROS = [
        10   => 30,
        100  => 100,
        1000 => 300,
    ];

    // ─── Milestone: total focus hours (all time) ──────────────────────────────

    /**
     * Bonuses when the user crosses these cumulative focus-hour thresholds.
     * Key = hours, value = bonus points.
     */
    const MILESTONES_TOTAL_HOURS = [
        10  => 150,
        100 => 500,
        500 => 2000,
    ];

    // ─── Milestone: focus hours per project / per category ───────────────────

    const MILESTONES_SCOPED_HOURS = [
        10  => 75,
        100 => 250,
        500 => 1000,
    ];

    // ─── Random reward ────────────────────────────────────────────────────────

    /** Probability (0–1) of a random bonus being awarded after any pomodoro. */
    const RANDOM_CHANCE = 0.05; // 5 %

    /** Range of the random bonus (inclusive). */
    const RANDOM_MIN = 5;
    const RANDOM_MAX = 30;
}
