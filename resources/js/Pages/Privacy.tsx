import AppFooter from '@/Components/AppFooter';
import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import ThemePicker from '@/Components/ThemePicker';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Privacy() {
    const { t } = useTranslation();
    const { support_email } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`${t('privacy.title')} — ${t('app.name')}`} />

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

                    <Link href={route('welcome')} className="mb-8 flex items-center gap-1.5 text-xs text-whisper/50 transition-colors hover:text-moonbeam">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>

                    <h1 className="mb-2 text-3xl font-black tracking-tight text-moonbeam">{t('privacy.title')}</h1>
                    <p className="mb-8 text-sm text-whisper/50">{t('privacy.intro')}</p>

                    <div className="space-y-8 text-sm leading-relaxed text-whisper/70">

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('privacy.data_collected')}</h2>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Adresse e-mail et nom d'utilisateur lors de l'inscription</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Sessions Pomodoro : durée, heure de début et de fin</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Projets et catégories créés par l'utilisateur</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Points et progression dans les niveaux</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Préférences de langue et de thème</li>
                            </ul>
                            <p className="mt-3 text-whisper/50">
                                En mode invité, aucune donnée n'est enregistrée sur nos serveurs.
                                Les préférences sont stockées localement dans votre navigateur (localStorage).
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('privacy.data_use')}</h2>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Fournir et améliorer les fonctionnalités de l'application</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Afficher vos statistiques et votre progression</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Calculer le classement communautaire anonymisé</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Envoyer des notifications de session (uniquement si activé)</li>
                            </ul>
                            <p className="mt-3 text-whisper/50">
                                Nous ne vendons pas vos données personnelles à des tiers.
                                Vos données ne sont pas utilisées à des fins publicitaires.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">Cookies</h2>
                            <p>
                                PomoBloom utilise des cookies fonctionnels uniquement pour maintenir votre session active
                                et mémoriser vos préférences (langue, thème). Aucun cookie publicitaire ou de traçage n'est utilisé.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">Conservation des données</h2>
                            <p>
                                Vos données sont conservées tant que votre compte est actif.
                                En cas de suppression de compte, toutes vos données personnelles sont effacées définitivement.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('privacy.rights')}</h2>
                            <p className="mb-3">
                                Conformément au RGPD, vous disposez des droits suivants :
                            </p>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Droit d'accès à vos données personnelles</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Droit de rectification</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Droit à l'effacement (supprimez votre compte depuis les paramètres)</li>
                                <li className="flex items-start gap-2"><span className="mt-0.5 text-ember">·</span> Droit à la portabilité</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-base font-bold text-moonbeam">{t('privacy.contact')}</h2>
                            <p>
                                Pour exercer vos droits ou pour toute question relative à la protection de vos données,
                                contactez-nous à{' '}
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
