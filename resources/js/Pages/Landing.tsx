import AppFooter from '@/Components/AppFooter';
import AppLogo from '@/Components/AppLogo';
import PlantAvatar from '@/Components/PlantAvatar';
import { PageProps, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

// ── Feature card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="rounded-2xl border border-boundary/60 bg-depth p-6 transition-colors hover:border-ember/30 hover:bg-depth/80">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-ember/20 bg-ember/10 text-ember">
                {icon}
            </div>
            <h3 className="mb-2 text-sm font-bold text-moonbeam">{title}</h3>
            <p className="text-xs leading-relaxed text-whisper/65">{desc}</p>
        </div>
    );
}

// ── Step ────────────────────────────────────────────────────────────────────
function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember/10 text-xs font-black text-ember">
                {n}
            </div>
            <div>
                <h4 className="mb-1 text-sm font-bold text-moonbeam">{title}</h4>
                <p className="text-xs leading-relaxed text-whisper/60">{desc}</p>
            </div>
        </div>
    );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Landing() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user as User | null;

    return (
        <>
            <Head>
                <title>PomoBloom — Le Pomodoro qui récompense votre focus</title>
                <meta name="description" content="Timer Pomodoro gamifié. Gagnez des points, montez en niveau, débloquez des thèmes. Vos sessions de focus méritent d'être célébrées." />
            </Head>

            <div className="flex min-h-screen flex-col bg-abyss">

                {/* ── Navbar ──────────────────────────────────────────────── */}
                <header className="sticky top-0 z-40 border-b border-boundary/30 bg-abyss/90 backdrop-blur-md">
                    <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                        <div className="flex items-center gap-2.5 text-ember">
                            <AppLogo size={24} />
                            <span className="text-sm font-bold tracking-tight text-moonbeam">PomoBloom</span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-ember px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
                                >
                                    Mon tableau de bord →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden rounded-full border border-boundary/60 px-4 py-1.5 text-xs font-medium text-whisper transition-all hover:border-whisper/50 hover:text-moonbeam sm:block"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-ember px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
                                    >
                                        Créer un compte
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">

                    {/* ── Hero ────────────────────────────────────────────── */}
                    <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
                        {/* Background glows */}
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-ember/10 blur-3xl" />
                            <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-bloom/8 blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-aurora/8 blur-3xl" />
                        </div>

                        <div className="relative mx-auto max-w-2xl">
                            {/* Badge */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ember">
                                🌱 Timer Pomodoro · Gratuit · Sans inscription
                            </div>

                            {/* Headline */}
                            <h1 className="mb-5 text-4xl font-black leading-tight tracking-tight text-moonbeam sm:text-5xl">
                                Le Pomodoro qui{' '}
                                <span className="bg-gradient-to-r from-ember to-bloom bg-clip-text text-transparent">
                                    récompense votre focus
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-whisper/70">
                                Travaillez par sessions de 25 minutes, gagnez des points, montez en niveau et regardez votre plante intérieure s'épanouir. La productivité mérite d'être célébrée.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('register')}
                                    className="w-full rounded-full bg-ember px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember/30 transition-all hover:brightness-110 active:scale-95 sm:w-auto"
                                >
                                    Créer mon compte gratuit →
                                </Link>
                                <Link
                                    href={route('welcome')}
                                    className="w-full rounded-full border border-boundary/60 bg-surface/40 px-8 py-3.5 text-sm font-semibold text-whisper/80 backdrop-blur-sm transition-all hover:border-whisper/40 hover:text-moonbeam sm:w-auto"
                                >
                                    Essayer sans compte
                                </Link>
                            </div>

                            <p className="mt-4 text-[11px] text-whisper/35">
                                Aucune carte bancaire · Aucune installation · 100% gratuit
                            </p>
                        </div>
                    </section>

                    {/* ── Social proof strip ──────────────────────────────── */}
                    <section className="border-y border-boundary/30 bg-depth/40 px-6 py-5">
                        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6 sm:gap-10">
                            {[
                                { icon: '⏱️', label: 'Timer fonctionnel en 2 secondes' },
                                { icon: '🎮', label: '20 niveaux à débloquer' },
                                { icon: '🎨', label: '8 thèmes visuels' },
                                { icon: '📊', label: 'Stats & classement' },
                            ].map(({ icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-xs text-whisper/60">
                                    <span className="text-base">{icon}</span>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Features ────────────────────────────────────────── */}
                    <section className="px-6 py-20">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-ember">Fonctionnalités</p>
                                <h2 className="text-2xl font-black text-moonbeam">Tout ce qu'il vous faut pour rester focusé</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <FeatureCard
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                    }
                                    title="Timer Pomodoro"
                                    desc="Sessions de 25 min, pauses courtes et longues, notifications de fin de session. Personnalisable à volonté."
                                />
                                <FeatureCard
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                                        </svg>
                                    }
                                    title="Gamification & XP"
                                    desc="Gagnez des points à chaque session, montez de niveau, débloquez de nouveaux titres et regardez votre avatar évoluer."
                                />
                                <FeatureCard
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                                        </svg>
                                    }
                                    title="Stats & progression"
                                    desc="Suivez vos heures de focus, votre série de jours consécutifs, vos sessions par projet et votre classement entre amis."
                                />
                                <FeatureCard
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                                        </svg>
                                    }
                                    title="8 thèmes visuels"
                                    desc="Botanique, Conquête, Médiéval, Spatial, Kawaii, Animaux, Prestige… Choisissez l'univers qui vous inspire."
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── How it works ────────────────────────────────────── */}
                    <section className="border-y border-boundary/30 bg-depth/30 px-6 py-20">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-bloom">Comment ça marche</p>
                                <h2 className="text-2xl font-black text-moonbeam">Simple comme 1, 2, 3</h2>
                            </div>

                            <div className="mx-auto grid max-w-lg gap-8">
                                <Step
                                    n={1}
                                    title="Lancez un pomodoro"
                                    desc="Cliquez sur Démarrer. 25 minutes de focus complet sur votre tâche. Aucune distraction. Un seul objectif."
                                />
                                <Step
                                    n={2}
                                    title="Gagnez des points & montez de niveau"
                                    desc="Chaque session complétée rapporte des XP. Premières sessions du jour, séries consécutives, jalons… les bonus s'accumulent."
                                />
                                <Step
                                    n={3}
                                    title="Suivez votre progression"
                                    desc="Consultez vos stats, comparez-vous au classement, associez vos sessions à des projets et observez vos habitudes se construire."
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── Levels showcase ──────────────────────────────────── */}
                    <section className="px-6 py-20">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-4 text-center">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-aurora/80">Gamification</p>
                                <h2 className="mb-3 text-2xl font-black text-moonbeam">20 niveaux à débloquer</h2>
                                <p className="mx-auto max-w-md text-sm text-whisper/60">
                                    De la Graine à l'Esprit du Jardin — chaque pomodoro vous rapproche du prochain palier.
                                </p>
                            </div>

                            {/* Avatar grid preview — levels 1–10 */}
                            <div className="mt-10 flex flex-wrap justify-center gap-3">
                                {[1,2,3,4,5,6,7,8,9,10].map((lvl) => (
                                    <div
                                        key={lvl}
                                        className="flex flex-col items-center gap-1 rounded-xl border border-boundary/50 bg-depth px-3 py-3 transition-colors hover:border-ember/30"
                                    >
                                        <PlantAvatar level={lvl} size={38} />
                                        <span className="text-[10px] font-bold tabular-nums text-whisper/50">{lvl}</span>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-boundary/30 bg-depth/50 px-3 py-3">
                                    <span className="text-xl text-whisper/30">···</span>
                                    <span className="text-[10px] font-bold text-whisper/30">+10</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Final CTA ───────────────────────────────────────── */}
                    <section className="px-6 pb-24">
                        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ember/20 bg-gradient-to-br from-ember/10 via-depth to-bloom/8 p-12 text-center shadow-2xl shadow-black/60">
                            {/* Glow */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-ember/5 to-transparent" />

                            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-ember">Prêt à commencer ?</p>
                            <h2 className="mb-4 text-3xl font-black text-moonbeam">
                                Votre focus mérite<br />d'être récompensé.
                            </h2>
                            <p className="mx-auto mb-8 max-w-sm text-sm text-whisper/60">
                                Rejoignez PomoBloom et transformez chaque session de travail en une victoire mesurable.
                            </p>

                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Link
                                    href={route('register')}
                                    className="w-full rounded-full bg-ember px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember/30 transition-all hover:brightness-110 sm:w-auto"
                                >
                                    Créer mon compte — c'est gratuit
                                </Link>
                                <Link
                                    href={route('welcome')}
                                    className="w-full rounded-full border border-boundary/60 px-8 py-3.5 text-sm font-semibold text-whisper/70 transition-all hover:border-whisper/40 hover:text-moonbeam sm:w-auto"
                                >
                                    Essayer sans compte
                                </Link>
                            </div>
                        </div>
                    </section>

                </main>

                <AppFooter />
            </div>
        </>
    );
}
