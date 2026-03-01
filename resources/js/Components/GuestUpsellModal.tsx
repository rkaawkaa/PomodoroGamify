/**
 * GuestUpsellModal — shown to guest users after every 5th completed pomodoro.
 * Highlights the benefits of creating a free account.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const BENEFITS = [
    { emoji: '💾', fr: 'Sauvegarde toutes tes sessions automatiquement', en: 'Save all your sessions automatically' },
    { emoji: '📊', fr: 'Accède à des statistiques détaillées de ta progression', en: 'Access detailed progress statistics' },
    { emoji: '🎯', fr: 'Organise ton travail avec des projets & catégories', en: 'Organise your work with projects & categories' },
    { emoji: '🏆', fr: 'Gagne des points, monte de niveau et débloque des récompenses', en: 'Earn points, level up and unlock rewards' },
    { emoji: '🔥', fr: 'Partage tes victoires avec la communauté', en: 'Share your victories with the community' },
    { emoji: '🎨', fr: 'Personnalise ton thème et ton expérience', en: 'Customise your theme and experience' },
];

interface Props {
    onDismiss: () => void;
}

export default function GuestUpsellModal({ onDismiss }: Props) {
    const { locale } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onDismiss, 300);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end justify-center p-4 transition-all duration-300 sm:items-center ${
                visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'
            }`}
            onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
        >
            <div
                className={`relative w-full max-w-sm overflow-hidden rounded-3xl border border-boundary/40 bg-depth shadow-2xl shadow-black/70 transition-all duration-300 ${
                    visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                }`}
            >
                {/* Gradient accent */}
                <div className="h-0.5 bg-gradient-to-r from-ember via-bloom/60 to-ember" />

                <div className="px-6 pb-6 pt-5">
                    {/* Close */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-whisper/30 transition-colors hover:bg-surface hover:text-whisper/70"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 1l8 8M9 1L1 9" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="mb-4 text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/15 text-2xl">
                            🌱
                        </div>
                        <h2 className="text-base font-bold text-moonbeam">
                            {locale === 'fr' ? 'Bravo pour ce pomodoro !' : 'Great pomodoro!'}
                        </h2>
                        <p className="mt-1 text-[11px] text-whisper/50">
                            {locale === 'fr'
                                ? 'Crée un compte gratuit pour aller encore plus loin.'
                                : 'Create a free account to go even further.'}
                        </p>
                    </div>

                    {/* Benefits */}
                    <ul className="mb-5 space-y-2">
                        {BENEFITS.map((b) => (
                            <li key={b.emoji} className="flex items-start gap-2.5">
                                <span className="mt-0.5 shrink-0 text-sm">{b.emoji}</span>
                                <span className="text-[11px] leading-snug text-whisper/60">
                                    {locale === 'fr' ? b.fr : b.en}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTAs */}
                    <div className="flex flex-col gap-2">
                        <Link
                            href={route('register')}
                            className="block rounded-full bg-ember py-2.5 text-center text-xs font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:brightness-110 active:scale-95"
                        >
                            {locale === 'fr' ? 'Créer un compte gratuit →' : 'Create a free account →'}
                        </Link>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="rounded-full py-2 text-center text-[11px] font-medium text-whisper/35 transition-colors hover:text-whisper/60"
                        >
                            {locale === 'fr' ? 'Continuer sans compte' : 'Continue without an account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
