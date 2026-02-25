import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const SUPPORTED_LOCALES: Locale[] = ['en', 'fr'];

interface LocaleSwitcherProps {
    className?: string;
}

export default function LocaleSwitcher({ className = '' }: LocaleSwitcherProps) {
    const { locale, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onOutsideClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onOutsideClick);
        return () => document.removeEventListener('mousedown', onOutsideClick);
    }, []);

    const switchTo = (next: Locale) => {
        setOpen(false);
        if (next === locale) return;
        router.post(route('locale.update'), { locale: next }, { preserveScroll: true });
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-whisper transition-colors hover:text-moonbeam"
            >
                {locale}
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

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-[130px] overflow-hidden rounded-lg border border-boundary bg-depth shadow-xl shadow-black/50">
                    {SUPPORTED_LOCALES.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => switchTo(loc)}
                            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-medium uppercase tracking-widest transition-colors hover:bg-surface ${
                                loc === locale ? 'text-ember' : 'text-whisper'
                            }`}
                        >
                            {t(`locale.${loc}`)}
                            {loc === locale && (
                                <svg
                                    className="h-3 w-3 shrink-0"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 6l3 3 5-5" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
