import AppFooter from '@/Components/AppFooter';
import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import ThemePicker from '@/Components/ThemePicker';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Legal() {
    const { t } = useTranslation();
    const { support_email } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`${t('legal.title')} — ${t('app.name')}`} />

            <div className="flex min-h-screen flex-col bg-abyss">

                {/* Minimal nav */}
                <header className="flex items-center justify-between border-b border-boundary/30 bg-depth/80 px-6 py-4">
                    <Link href={route('welcome')} className="flex items-center gap-2.5 text-ember">
                        <AppLogo size={22} />
                        <span className="text-sm font-bold tracking-tight text-moonbeam">{t('app.name')}</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LocaleSwitcher />
                        <span className="select-none text-boundary/40">|</span>
                        <ThemePicker />
                    </div>
                </header>

                <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">

                    <Link href={route('welcome')} className="mb-8 flex items-center gap-1.5 text-xs text-whisper/70 transition-colors hover:text-moonbeam">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>

                    <h1 className="mb-8 text-3xl font-black tracking-tight text-moonbeam">{t('legal.title')}</h1>

                    <div className="space-y-8 text-sm leading-relaxed text-whisper/70">

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('legal.company')}</h2>
                            <p>PomoBloom</p>
                            <p className="mt-1 text-whisper/50">
                                Application web de gestion de sessions de travail par la méthode Pomodoro,
                                avec système de gamification et suivi de productivité.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('legal.hosting')}</h2>
                            <p>
                                Cette application est hébergée sur des serveurs sécurisés.
                                Les données sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">Propriété intellectuelle</h2>
                            <p>
                                L'ensemble du contenu de cette application (design, textes, illustrations, code) est protégé par le droit d'auteur.
                                Toute reproduction sans autorisation est interdite.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">Responsabilité</h2>
                            <p>
                                PomoBloom met tout en œuvre pour assurer la disponibilité et la fiabilité de l'application,
                                mais ne saurait être tenu responsable en cas d'interruption de service ou de perte de données.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('legal.contact')}</h2>
                            <p>
                                Pour toute question relative aux présentes mentions légales,
                                vous pouvez nous contacter à{' '}
                                <a href={`mailto:${support_email}`} className="text-ember hover:underline">{support_email}</a>.
                            </p>
                        </section>

                    </div>
                </main>

                <AppFooter />
            </div>
        </>
    );
}
