import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import UserMenu from '@/Components/UserMenu';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    onManage?: () => void;
}

export default function AuthenticatedLayout({ children, onManage }: Props) {
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
                        <LocaleSwitcher />
                        <span className="select-none text-boundary">|</span>
                        <UserMenu onManage={onManage ?? (() => {})} />
                    </div>
                </div>
            </nav>

            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
