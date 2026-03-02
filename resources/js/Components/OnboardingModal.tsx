/**
 * OnboardingModal — shown once after registration.
 * 8-step carousel explaining the main features.
 * Persists completion via POST /onboarding/complete.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Step {
    icon: string;
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
    tipFr?: string;
    tipEn?: string;
}

const STEPS: Step[] = [
    {
        icon: '🌱',
        titleFr: 'Bienvenue sur PomoBloom !',
        titleEn: 'Welcome to PomoBloom!',
        descFr: 'Voici un tour rapide pour t\'aider à démarrer. Tu peux le revoir à tout moment depuis ton profil.',
        descEn: 'Here\'s a quick tour to get you started. You can revisit it anytime from your profile.',
    },
    {
        icon: '📁',
        titleFr: 'Projets',
        titleEn: 'Projects',
        descFr: 'Crée des projets pour organiser ton travail. Sélectionne-en un sur la carte minuteur avant de démarrer un pomodoro.',
        descEn: 'Create projects to organize your work. Select one on the timer card before starting a pomodoro.',
        tipFr: '💡 Ton 1er projet te rapporte 50 pts bonus !',
        tipEn: '💡 Your 1st project earns you 50 bonus pts!',
    },
    {
        icon: '🏷️',
        titleFr: 'Catégories',
        titleEn: 'Categories',
        descFr: 'Tague tes sessions avec des catégories — "Deep Work", "Étude", "Créativité"... Pour suivre comment tu passes ton temps.',
        descEn: 'Tag your sessions with categories — "Deep Work", "Study", "Creative"... Track how you spend your time.',
        tipFr: '💡 1ère catégorie = +50 pts !',
        tipEn: '💡 1st category = +50 pts!',
    },
    {
        icon: '⏱️',
        titleFr: 'Lance ton minuteur',
        titleEn: 'Start your timer',
        descFr: 'Sélectionne un projet ou une catégorie, puis appuie sur Démarrer. À la fin du pomodoro, tes points s\'accumulent automatiquement.',
        descEn: 'Select a project or category, then press Start. When the pomodoro ends, your points accumulate automatically.',
        tipFr: '💡 1er pomodoro lié = +75 pts !',
        tipEn: '💡 1st linked pomodoro = +75 pts!',
    },
    {
        icon: '🔥',
        titleFr: 'La Flamme',
        titleEn: 'The Flame',
        descFr: 'Clique sur le bouton 🔥 près du minuteur pour partager tes victoires du jour avec la communauté. Les messages les plus likés reviennent t\'inspirer !',
        descEn: 'Click the 🔥 button near the timer to share your daily wins with the community. The most-liked messages come back to inspire you!',
    },
    {
        icon: '🎨',
        titleFr: 'Choisis ton thème',
        titleEn: 'Choose your theme',
        descFr: 'Change l\'apparence de l\'app depuis la navbar. Guerrier, Scientifique, Médiéval, Spatial, Kawaii, Animaux... à toi de choisir !',
        descEn: 'Change the app\'s look from the navbar. Warrior, Scientist, Medieval, Space, Kawaii, Animals... your call!',
    },
    {
        icon: '⭐',
        titleFr: 'Points & Niveaux',
        titleEn: 'Points & Levels',
        descFr: 'Chaque pomodoro terminé rapporte des points. Enchaîne les sessions pour des bonus de série, atteins des milestones et monte de niveau !',
        descEn: 'Each completed pomodoro earns points. Chain sessions for streak bonuses, hit milestones, and level up!',
    },
    {
        icon: '📊',
        titleFr: 'Suis tes stats',
        titleEn: 'Track your stats',
        descFr: 'La page Stats montre ton historique, tes heures de focus, ta série de jours consécutifs et ton classement dans la communauté.',
        descEn: 'The Stats page shows your history, focus hours, consecutive day streak, and your community ranking.',
    },
];

interface Props {
    onDismiss: () => void;
}

export default function OnboardingModal({ onDismiss }: Props) {
    const { locale } = useTranslation();
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(false);
    const [completing, setCompleting] = useState(false);

    const isFr = locale === 'fr';
    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleDismiss = () => {
        if (completing) return;
        setCompleting(true);
        setVisible(false);
        router.post(route('onboarding.complete'), {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setTimeout(onDismiss, 350),
        });
    };

    const handleNext = () => {
        if (isLast) { handleDismiss(); return; }
        setStep((s) => s + 1);
    };

    const handlePrev = () => setStep((s) => Math.max(0, s - 1));

    return (
        <div
            className={`fixed inset-0 z-[80] flex items-center justify-center px-4 transition-all duration-350 ${
                visible ? 'bg-black/75 backdrop-blur-sm' : 'bg-transparent'
            }`}
        >
            <div
                className={`relative w-full max-w-sm overflow-hidden rounded-3xl border border-ember/30 bg-depth shadow-2xl shadow-black/70 transition-all duration-350 ${
                    visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
            >
                {/* Top glowing strip */}
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-ember/60 to-transparent" />

                {/* Shimmer */}
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-ember/4 via-transparent to-ember/2" />

                <div className="flex flex-col items-center px-7 py-8 text-center">

                    {/* Step indicator */}
                    <div className="mb-5 flex items-center gap-1.5">
                        {STEPS.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setStep(i)}
                                className={`rounded-full transition-all duration-200 ${
                                    i === step
                                        ? 'h-1.5 w-5 bg-ember'
                                        : i < step
                                        ? 'h-1.5 w-1.5 bg-ember/40'
                                        : 'h-1.5 w-1.5 bg-boundary/40'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-4xl">
                        {current.icon}
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 text-base font-bold text-moonbeam">
                        {isFr ? current.titleFr : current.titleEn}
                    </h2>

                    {/* Description */}
                    <p className="mb-3 text-sm leading-relaxed text-whisper/60">
                        {isFr ? current.descFr : current.descEn}
                    </p>

                    {/* Tip */}
                    {(isFr ? current.tipFr : current.tipEn) && (
                        <p className="mb-5 rounded-xl border border-ember/20 bg-ember/8 px-3 py-2 text-[11px] font-medium text-ember/80">
                            {isFr ? current.tipFr : current.tipEn}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="mt-2 flex w-full items-center gap-2">
                        {step > 0 ? (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="flex-1 rounded-full border border-boundary bg-surface/50 py-2.5 text-xs font-semibold text-whisper transition-all hover:border-whisper/40 hover:text-moonbeam active:scale-95"
                            >
                                ← {isFr ? 'Précédent' : 'Previous'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="flex-1 rounded-full border border-boundary bg-surface/50 py-2.5 text-xs font-semibold text-whisper/50 transition-all hover:border-whisper/30 hover:text-whisper active:scale-95"
                            >
                                {isFr ? 'Passer' : 'Skip'}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={completing}
                            className="flex-1 rounded-full border border-ember/40 bg-ember/10 py-2.5 text-xs font-semibold text-ember transition-all hover:bg-ember/20 active:scale-95 disabled:opacity-60"
                        >
                            {isLast
                                ? (isFr ? 'Commencer ! 🚀' : 'Get started! 🚀')
                                : (isFr ? 'Suivant →' : 'Next →')}
                        </button>
                    </div>

                    {/* Step count */}
                    <p className="mt-3 text-[9px] tabular-nums text-whisper/25">
                        {step + 1} / {STEPS.length}
                    </p>
                </div>
            </div>
        </div>
    );
}
