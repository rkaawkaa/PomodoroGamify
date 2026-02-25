<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pomodoro_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('duration_seconds');
            $table->timestamp('ended_at');
            $table->timestamps();
        });

        Schema::create('category_pomodoro_session', function (Blueprint $table) {
            $table->foreignId('pomodoro_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->primary(['pomodoro_session_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_pomodoro_session');
        Schema::dropIfExists('pomodoro_sessions');
    }
};
