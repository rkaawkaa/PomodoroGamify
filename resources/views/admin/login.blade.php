<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin · PomoBloom</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        abyss:    '#0e0e16',
                        depth:    '#181824',
                        surface:  '#22223a',
                        boundary: '#353550',
                        whisper:  '#8888aa',
                        moonbeam: '#ddddf5',
                        ember:    '#d95f3b',
                    }
                }
            }
        }
    </script>
</head>
<body class="min-h-screen bg-abyss flex items-center justify-center px-4">

    <div class="w-full max-w-sm">

        {{-- Logo --}}
        <div class="mb-8 text-center">
            <p class="text-xs font-bold uppercase tracking-widest text-whisper/50 mb-1">Administration</p>
            <h1 class="text-2xl font-black text-moonbeam">PomoBloom</h1>
        </div>

        {{-- Card --}}
        <div class="rounded-2xl border border-boundary bg-depth p-8 shadow-2xl shadow-black/60">

            <h2 class="mb-6 text-sm font-bold text-moonbeam">Connexion admin</h2>

            @if($errors->has('credentials'))
                <div class="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
                    {{ $errors->first('credentials') }}
                </div>
            @endif

            <form method="POST" action="{{ route('admin.login.post') }}" class="space-y-4">
                @csrf

                <div>
                    <label for="email" class="mb-1.5 block text-xs font-semibold text-whisper/70">
                        Adresse e-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value="{{ old('email') }}"
                        required
                        autofocus
                        class="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                        placeholder="admin@example.com"
                    >
                </div>

                <div>
                    <label for="password" class="mb-1.5 block text-xs font-semibold text-whisper/70">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        class="w-full rounded-lg border border-boundary bg-surface px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 outline-none transition-colors focus:border-ember/60 focus:ring-1 focus:ring-ember/20"
                        placeholder="••••••••"
                    >
                </div>

                <button
                    type="submit"
                    class="mt-2 w-full rounded-lg bg-ember/20 py-2.5 text-sm font-bold text-ember transition-colors hover:bg-ember/30"
                >
                    Se connecter
                </button>
            </form>
        </div>

        <p class="mt-6 text-center text-[11px] text-whisper/30">
            Accès réservé · PomoBloom Admin
        </p>
    </div>

</body>
</html>
