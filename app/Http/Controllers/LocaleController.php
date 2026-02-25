<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $supported = config('app.supported_locales', ['en', 'fr']);

        $request->validate([
            'locale' => ['required', 'string', Rule::in($supported)],
        ]);

        $locale = $request->string('locale')->toString();

        // Persiste dans le profil si connecté
        if (Auth::check()) {
            Auth::user()->update(['locale' => $locale]);
        }

        // Persiste en session dans tous les cas (utile pour les visiteurs)
        session(['locale' => $locale]);

        return back();
    }
}
