import { useTranslation } from '@/hooks/useTranslation';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    onManage: () => void;
}

export default function UserMenu({ onManage }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-whisper transition-colors hover:text-moonbeam"
            >
                {auth.user.name}
                <svg
                    className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 3.5l3 3 3-3" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-[230px] overflow-hidden rounded-lg border border-boundary bg-depth shadow-xl shadow-black/50">
                    {/* Manage projects & categories */}
                    <button
                        type="button"
                        onClick={() => { setOpen(false); onManage(); }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium text-whisper transition-colors hover:bg-surface hover:text-moonbeam"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {t('nav.manage')}
                    </button>

                    <div className="mx-3.5 border-t border-boundary/40" />

                    {/* Logout */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium text-whisper transition-colors hover:bg-surface hover:text-moonbeam"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {t('nav.logout')}
                    </Link>
                </div>
            )}
        </div>
    );
}
