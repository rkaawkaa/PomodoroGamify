import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types';
import { router } from '@inertiajs/react';

interface LocaleSwitcherProps {
    className?: string;
}

export default function LocaleSwitcher({ className = '' }: LocaleSwitcherProps) {
    const { locale } = useTranslation();

    const switchTo = (next: Locale) => {
        if (next === locale) return;
        router.post(route('locale.update'), { locale: next }, { preserveScroll: true });
    };

    return (
        <span className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest ${className}`}>
            <button
                onClick={() => switchTo('en')}
                className={
                    locale === 'en'
                        ? 'text-moonbeam'
                        : 'text-boundary hover:text-whisper transition-colors'
                }
            >
                EN
            </button>
            <span className="text-boundary select-none">·</span>
            <button
                onClick={() => switchTo('fr')}
                className={
                    locale === 'fr'
                        ? 'text-moonbeam'
                        : 'text-boundary hover:text-whisper transition-colors'
                }
            >
                FR
            </button>
        </span>
    );
}
