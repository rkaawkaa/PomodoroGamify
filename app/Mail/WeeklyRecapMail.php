<?php

namespace App\Mail;

use App\Models\User;
use App\Services\RecapMailService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class WeeklyRecapMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $stats;

    public function __construct(public User $user, private RecapMailService $service)
    {
        App::setLocale($user->locale ?? 'fr');
        $from      = now()->subWeek()->startOfWeek();
        $to        = now()->subWeek()->endOfWeek();
        $this->stats = $this->service->stats($user, $from, $to);
    }

    public function envelope(): Envelope
    {
        App::setLocale($this->user->locale ?? 'fr');
        return new Envelope(
            subject: __('mail.recap.weekly_subject', ['name' => config('app.name')]),
        );
    }

    public function content(): Content
    {
        App::setLocale($this->user->locale ?? 'fr');
        return new Content(
            markdown: 'mail.recap',
            with: [
                'user'          => $this->user,
                'stats'         => $this->stats,
                'periodType'    => 'weekly',
                'periodLabel'   => __('mail.recap.period_weekly'),
                'encouragement' => RecapMailService::encouragement($this->user->locale ?? 'fr'),
                'dashboardUrl'  => route('stats'),
            ],
        );
    }
}
