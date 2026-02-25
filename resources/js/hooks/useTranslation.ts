import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

/**
 * Hook de traduction pour PomoBloom.
 *
 * Usage :
 *   const { t, locale } = useTranslation();
 *   t('auth.login.title')                         → "Welcome back"
 *   t('timer.session', { number: '3' })           → "Session 3"
 *   t('gamification.level', { number: '5' })      → "Level 5"
 */
export function useTranslation() {
    const { translations, locale } = usePage<PageProps>().props;

    const t = (key: string, replacements?: Record<string, string>): string => {
        let translation: string = translations[key] ?? key;

        if (replacements) {
            Object.entries(replacements).forEach(([k, v]) => {
                translation = translation.replace(`:${k}`, v);
            });
        }

        return translation;
    };

    return { t, locale };
}
