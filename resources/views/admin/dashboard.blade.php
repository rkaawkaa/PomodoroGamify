<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard · PomoBloom</title>
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
                        bloom:    '#4caf82',
                        aurora:   '#9b7de0',
                    }
                }
            }
        }
    </script>
</head>
<body class="min-h-screen bg-abyss text-moonbeam">

    {{-- Navbar --}}
    <nav class="border-b border-boundary/40 bg-depth px-6 py-4">
        <div class="mx-auto flex max-w-7xl items-center justify-between">
            <div>
                <span class="text-xs font-bold uppercase tracking-widest text-whisper/50">Administration</span>
                <h1 class="text-lg font-black text-moonbeam leading-none">PomoBloom</h1>
            </div>
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit" class="rounded-lg border border-boundary px-4 py-1.5 text-xs font-semibold text-whisper/70 transition-colors hover:border-whisper/40 hover:text-moonbeam">
                    Se déconnecter
                </button>
            </form>
        </div>
    </nav>

    <div class="mx-auto max-w-7xl px-6 py-10 space-y-8">

        {{-- KPI cards --}}
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div class="rounded-2xl border border-boundary bg-depth p-6">
                <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-whisper/50">Comptes créés</p>
                <p class="text-4xl font-black text-moonbeam">{{ number_format($totalUsers) }}</p>
            </div>

            <div class="rounded-2xl border border-boundary bg-depth p-6">
                <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-whisper/50">Sessions focus totales</p>
                <p class="text-4xl font-black text-ember">{{ number_format($totalSessions) }}</p>
            </div>

            <div class="rounded-2xl border border-boundary bg-depth p-6">
                <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-whisper/50">Sessions actives</p>
                <p class="text-4xl font-black text-aurora">{{ number_format($activeSessions) }}</p>
                <p class="mt-1 text-[11px] text-whisper/40">connectés en ce moment</p>
            </div>

        </div>

        {{-- Users table --}}
        <div class="rounded-2xl border border-boundary bg-depth overflow-hidden">

            <div class="px-6 py-4 border-b border-boundary/60">
                <h2 class="text-sm font-bold text-moonbeam">Comptes utilisateurs</h2>
                <p class="text-xs text-whisper/50">{{ $totalUsers }} compte{{ $totalUsers > 1 ? 's' : '' }} · trié par nombre de pomodoros</p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-boundary/40 bg-surface/40">
                            <th class="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-whisper/50">#</th>
                            <th class="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-whisper/50">Nom d'utilisateur</th>
                            <th class="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-whisper/50">Adresse e-mail</th>
                            <th class="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-whisper/50">Pomodoros</th>
                            <th class="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-whisper/50">Points</th>
                            <th class="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-whisper/50">Inscrit le</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-boundary/30">
                        @forelse($users as $i => $user)
                            <tr class="transition-colors hover:bg-surface/30">
                                <td class="px-6 py-4 text-xs text-whisper/40">{{ $i + 1 }}</td>
                                <td class="px-6 py-4 font-semibold text-moonbeam">{{ $user->name }}</td>
                                <td class="px-6 py-4 text-whisper/70">{{ $user->email }}</td>
                                <td class="px-6 py-4 text-right">
                                    <span class="inline-flex items-center gap-1 rounded-full bg-ember/10 px-2.5 py-1 text-xs font-bold text-ember">
                                        {{ number_format($user->pomodoro_sessions_count) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <span class="text-xs font-bold text-aurora">{{ number_format($user->points) }}</span>
                                </td>
                                <td class="px-6 py-4 text-right text-xs text-whisper/50">
                                    {{ $user->created_at->format('d/m/Y') }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-10 text-center text-sm text-whisper/40">
                                    Aucun utilisateur enregistré.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <footer class="mt-8 border-t border-boundary/30 px-6 py-4 text-center">
        <p class="text-[11px] text-whisper/30">PomoBloom Admin · Accès restreint</p>
    </footer>

</body>
</html>
