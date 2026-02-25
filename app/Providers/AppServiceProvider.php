<?php

namespace App\Providers;

use App\Mail\PasswordChangedMail;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Bilingual password reset request email
        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $locale = $notifiable->locale ?? config('app.locale');
            app()->setLocale($locale);

            $resetUrl = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            $expireMinutes = config('auth.passwords.' . config('auth.defaults.passwords') . '.expire');

            return (new MailMessage)
                ->subject(__('mail.reset.subject'))
                ->markdown('mail.password-reset', [
                    'url'           => $resetUrl,
                    'expireMinutes' => $expireMinutes,
                ]);
        });

        // Confirmation email after successful password reset
        Event::listen(PasswordReset::class, function (PasswordReset $event) {
            $user = $event->user;
            Mail::to($user->email)
                ->locale($user->locale ?? config('app.locale'))
                ->send(new PasswordChangedMail($user));
        });
    }
}
