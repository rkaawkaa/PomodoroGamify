import AppLogo from '@/Components/AppLogo';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-abyss">
            <nav className="border-b border-boundary/50 bg-depth">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-2.5 text-ember"
                    >
                        <AppLogo size={28} />
                        <span className="text-sm font-semibold tracking-wide text-moonbeam">
                            {t('app.name')}
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-whisper">
                            {auth.user.name}
                        </span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm text-whisper transition-colors hover:text-moonbeam"
                        >
                            {t('nav.logout')}
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
