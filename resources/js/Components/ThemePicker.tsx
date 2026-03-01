import { THEMES } from '@/data/themes';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect, useRef, useState } from 'react';

export default function ThemePicker() {
    const { theme, setThemeId } = useTheme();
    const { locale } = useTranslation();
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
                title={locale === 'fr' ? 'Thème' : 'Theme'}
            >
                <span className="text-sm leading-none">{theme.icon}</span>
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
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-boundary bg-depth p-2.5 shadow-xl shadow-black/50">
                    <p className="mb-2 px-0.5 text-[9px] font-semibold uppercase tracking-widest text-whisper/50">
                        {locale === 'fr' ? 'Thème' : 'Theme'}
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                title={locale === 'fr' ? t.name.fr : t.name.en}
                                onClick={() => { setThemeId(t.id); setOpen(false); }}
                                className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center transition-colors hover:bg-surface ${
                                    theme.id === t.id ? 'bg-surface ring-1 ring-inset ring-ember/50' : ''
                                }`}
                            >
                                <span className="text-sm leading-none">{t.icon}</span>
                                <span className="w-full truncate text-[7px] leading-tight text-whisper/60">
                                    {locale === 'fr' ? t.name.fr : t.name.en}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
