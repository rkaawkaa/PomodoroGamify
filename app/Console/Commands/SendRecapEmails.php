<?php

namespace App\Console\Commands;

use App\Mail\MonthlyRecapMail;
use App\Mail\WeeklyRecapMail;
use App\Mail\YearlyRecapMail;
use App\Models\User;
use App\Services\RecapMailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendRecapEmails extends Command
{
    protected $signature   = 'recap:send {type : weekly, monthly or yearly}';
    protected $description = 'Send recap emails to users who opted in for email notifications';

    public function handle(RecapMailService $service): int
    {
        $type = $this->argument('type');

        if (!in_array($type, ['weekly', 'monthly', 'yearly'])) {
            $this->error("Invalid type: {$type}. Use weekly, monthly or yearly.");
            return self::FAILURE;
        }

        $users = User::where('email_notifications', true)->get();
        $count = 0;

        foreach ($users as $user) {
            try {
                $mail = match ($type) {
                    'weekly'  => new WeeklyRecapMail($user, $service),
                    'monthly' => new MonthlyRecapMail($user, $service),
                    'yearly'  => new YearlyRecapMail($user, $service),
                };

                // Only send if the user had at least one session in the period
                if ($mail->stats['total_sessions'] === 0) {
                    continue;
                }

                Mail::to($user->email)->send($mail);
                $count++;
            } catch (\Throwable $e) {
                $this->warn("Failed to send {$type} recap to {$user->email}: {$e->getMessage()}");
            }
        }

        $this->info("Sent {$type} recap to {$count} user(s).");
        return self::SUCCESS;
    }
}
