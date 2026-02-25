<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedSmallInteger('pomodoro_duration')->default(25)->after('locale');
            $table->unsignedSmallInteger('break_duration')->default(5)->after('pomodoro_duration');
            $table->boolean('auto_start_breaks')->default(false)->after('break_duration');
            $table->boolean('auto_start_pomodoros')->default(false)->after('auto_start_breaks');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pomodoro_duration', 'break_duration', 'auto_start_breaks', 'auto_start_pomodoros']);
        });
    }
};
