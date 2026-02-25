import AppLogo from '@/Components/AppLogo';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('app.name')} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-abyss">
                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="text-ember">
                        <AppLogo size={72} />
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-moonbeam">
                            {t('app.name')}
                        </h1>
                        <p className="mt-2 text-sm tracking-widest text-whisper uppercase">
                            {t('app.tagline')}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-ember px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95"
                            >
                                {t('nav.dashboard')}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-boundary px-6 py-2.5 text-sm font-medium text-whisper transition-all hover:border-ember/60 hover:text-moonbeam"
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-ember px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95"
                                >
                                    {t('auth.register')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
