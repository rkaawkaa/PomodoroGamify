import AppFooter from '@/Components/AppFooter';
import AppLogo from '@/Components/AppLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import ThemePicker from '@/Components/ThemePicker';
import UserMenu from '@/Components/UserMenu';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Link, router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren {
    onManage?: () => void;
}

export default function AuthenticatedLayout({ children, onManage }: Props) {
    const { t } = useTranslation();
    const { colorMode, toggleColorMode } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-abyss">
            <nav className="relative border-b border-boundary/50 bg-depth">
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

                    {/* Desktop right items */}
                    <div className="hidden items-center gap-4 md:flex">
                        <LocaleSwitcher />
                        <span className="select-none text-boundary">|</span>
                        <Link
                            href={route('help')}
                            title={t('nav.help')}
                            className="text-whisper/60 transition-colors hover:text-moonbeam"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </Link>
                        <span className="select-none text-boundary">|</span>
                        <ThemePicker />
                        <span className="select-none text-boundary">|</span>
                        <button
                            type="button"
                            onClick={toggleColorMode}
                            title={colorMode === 'dark' ? 'Mode clair' : 'Mode sombre'}
                            className="flex items-center justify-center text-whisper/60 transition-colors hover:text-moonbeam"
                        >
                            {colorMode === 'dark' ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                        </button>
                        <span className="select-none text-boundary">|</span>
                        <UserMenu onManage={onManage ?? (() => router.get(route('dashboard'), { manage: '1' }))} />
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="flex items-center justify-center text-whisper/60 transition-colors hover:text-moonbeam md:hidden"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Menu"
                    >
                        {menuOpen ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 border-b border-boundary/40 bg-depth/95 px-4 py-5 shadow-xl shadow-black/40 backdrop-blur-sm md:hidden">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <LocaleSwitcher />
                                <span className="select-none text-boundary/40">|</span>
                                <ThemePicker />
                                <span className="select-none text-boundary/40">|</span>
                                <button
                                    type="button"
                                    onClick={toggleColorMode}
                                    title={colorMode === 'dark' ? 'Mode clair' : 'Mode sombre'}
                                    className="flex items-center justify-center text-whisper/60 transition-colors hover:text-moonbeam"
                                >
                                    {colorMode === 'dark' ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"/>
                                            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <Link
                                href={route('help')}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 text-sm text-whisper/60 transition-colors hover:text-moonbeam"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                {t('nav.help')}
                            </Link>
                            <div className="h-px bg-boundary/30" />
                            <UserMenu onManage={onManage ?? (() => router.get(route('dashboard'), { manage: '1' }))} />
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex flex-1 flex-col">{children}</main>
            <AppFooter />
        </div>
    );
}
