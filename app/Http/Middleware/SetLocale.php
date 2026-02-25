<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->resolveLocale($request);

        app()->setLocale($locale);

        return $next($request);
    }

    private function resolveLocale(Request $request): string
    {
        $supported = config('app.supported_locales', ['en', 'fr']);

        // 1. Préférence sauvegardée de l'utilisateur connecté
        if (Auth::check() && Auth::user()->locale) {
            $userLocale = Auth::user()->locale;
            if (in_array($userLocale, $supported)) {
                return $userLocale;
            }
        }

        // 2. Session (changement temporaire sans être connecté)
        $sessionLocale = session('locale');
        if ($sessionLocale && in_array($sessionLocale, $supported)) {
            return $sessionLocale;
        }

        // 3. Header Accept-Language du navigateur
        $browserLocale = substr($request->getPreferredLanguage($supported) ?? '', 0, 2);
        if ($browserLocale && in_array($browserLocale, $supported)) {
            return $browserLocale;
        }

        // 4. Locale par défaut de l'app
        return config('app.locale', 'en');
    }
}
