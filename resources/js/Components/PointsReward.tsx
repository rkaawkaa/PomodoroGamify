import { useTranslation } from '@/hooks/useTranslation';
import { PointAward } from '@/types';
import { useEffect, useState } from 'react';

// ─── Event display metadata ────────────────────────────────────────────────

interface EventDisplay {
    emoji: string;
    label: string;
    accent: string; // tailwind text color
    isMilestone: boolean;
}

function useEventDisplay(award: PointAward): EventDisplay {
    const { t } = useTranslation();
    const key = award.event_key;
    const meta = award.meta ?? {};

    if (key === 'pomodoro_base')      return { emoji: '🍅', label: t('points.pomodoro_base'),  accent: 'text-ember',   isMilestone: false };
    if (key === 'daily_first')        return { emoji: '☀️', label: t('points.daily_first'),    accent: 'text-amber-400', isMilestone: false };
    if (key === 'daily_4th')          return { emoji: '🔥', label: t('points.daily_4th'),      accent: 'text-orange-400', isMilestone: false };
    if (key === 'daily_scaling')      return { emoji: '⚡', label: `${t('points.daily_scaling')} #${meta.n ?? ''}`, accent: 'text-aurora', isMilestone: false };
    if (key === 'streak_days')        return { emoji: '📅', label: `${meta.days ?? 3} ${t('points.streak_days')}`, accent: 'text-bloom', isMilestone: false };
    if (key === 'task_daily_1')       return { emoji: '✅', label: t('points.task_daily_1'),   accent: 'text-bloom',   isMilestone: false };
    if (key === 'task_daily_5')       return { emoji: '🎉', label: t('points.task_daily_5'),   accent: 'text-bloom',   isMilestone: false };
    if (key === 'task_daily_10')      return { emoji: '⭐', label: t('points.task_daily_10'),  accent: 'text-bloom',   isMilestone: false };
    if (key === 'random_reward')      return { emoji: '🎲', label: t('points.random_reward'),  accent: 'text-coral',   isMilestone: false };

    // Milestone events
    const label = t(`points.${key}`) ?? key;
    if (key.startsWith('milestone_total_'))            return { emoji: '🏆', label, accent: 'text-yellow-400', isMilestone: true };
    if (key.startsWith('milestone_project_hours_'))    return { emoji: '⏱️', label, accent: 'text-bloom',      isMilestone: true };
    if (key.startsWith('milestone_category_hours_'))   return { emoji: '⏱️', label, accent: 'text-bloom',      isMilestone: true };
    if (key.startsWith('milestone_hours_'))            return { emoji: '⏱️', label, accent: 'text-bloom',      isMilestone: true };
    if (key.startsWith('milestone_project_'))          return { emoji: '🎯', label, accent: 'text-aurora',     isMilestone: true };
    if (key.startsWith('milestone_category_'))         return { emoji: '🏷️', label, accent: 'text-aurora',    isMilestone: true };

    return { emoji: '✨', label, accent: 'text-whisper', isMilestone: false };
}

// ─── Individual award chip ─────────────────────────────────────────────────

function AwardChip({ award, delay }: { award: PointAward; delay: number }) {
    const display = useEventDisplay(award);
    return (
        <div
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
        >
            <span className="text-base leading-none">{display.emoji}</span>
            <span className={`flex-1 text-xs font-medium ${display.isMilestone ? display.accent + ' font-semibold' : 'text-whisper/80'}`}>
                {display.label}
            </span>
            <span className={`shrink-0 text-xs font-bold tabular-nums ${display.accent}`}>
                +{award.points}
            </span>
        </div>
    );
}

// ─── Animated counter ──────────────────────────────────────────────────────

function AnimatedCounter({ target }: { target: number }) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let frame: number;
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
            const pct = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - pct, 3);
            setValue(Math.round(eased * target));
            if (pct < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target]);
    return <>{value.toLocaleString()}</>;
}

// ─── Main component ────────────────────────────────────────────────────────

interface Props {
    awards: PointAward[];
    totalEarned: number;
    userPoints: number;
    onDismiss: () => void;
}

export default function PointsReward({ awards, totalEarned, userPoints, onDismiss }: Props) {
    const { t } = useTranslation();
    const [exiting, setExiting] = useState(false);

    const isMilestone = awards.some(
        (a) => a.event_key.startsWith('milestone_') || a.points >= 50
    );

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(onDismiss, 350);
    };

    // Filter out the boring base award if we have more exciting things to show
    const hasOtherAwards = awards.some((a) => a.event_key !== 'pomodoro_base');
    const visibleAwards = hasOtherAwards
        ? awards.filter((a) => a.event_key !== 'pomodoro_base')
        : awards;

    return (
        <div
            className={`fixed bottom-6 left-1/2 z-[60] w-full max-w-[22rem] -translate-x-1/2 px-3 transition-all duration-300 ${
                exiting ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
            } ${!exiting ? 'animate-in slide-in-from-bottom-6 fade-in duration-500' : ''}`}
        >
            {/* Card */}
            <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ${
                    isMilestone
                        ? 'border border-yellow-400/30 bg-gradient-to-b from-yellow-900/40 via-depth to-depth'
                        : 'border border-whisper/10 bg-depth'
                }`}
            >
                {/* Glowing top accent line */}
                <div className={`h-0.5 w-full ${isMilestone ? 'bg-gradient-to-r from-yellow-400/80 via-ember to-yellow-400/80' : 'bg-gradient-to-r from-ember/60 via-bloom/60 to-aurora/60'}`} />

                {/* Milestone shimmer background */}
                {isMilestone && (
                    <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-yellow-400/5 via-transparent to-ember/5" />
                )}

                {/* Close (X) button */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Fermer"
                    className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-whisper/40 transition-colors hover:bg-white/12 hover:text-moonbeam"
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M1 1l8 8M9 1l-8 8"/>
                    </svg>
                </button>

                <div className="px-5 pt-4 pb-4">
                    {/* Milestone badge */}
                    {isMilestone && (
                        <div className="mb-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.25em] text-yellow-400">
                                ✨ {t('points.milestone_banner')} ✨
                            </span>
                        </div>
                    )}

                    {/* Points earned — big counter */}
                    <div className="mb-3 flex items-baseline gap-2 pr-6">
                        <span className={`font-mono text-4xl font-black tabular-nums leading-none ${
                            isMilestone ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.4)]' : 'text-ember drop-shadow-[0_0_10px_rgba(249,115,22,0.35)]'
                        }`}>
                            +<AnimatedCounter target={totalEarned} />
                        </span>
                        <span className="text-sm font-semibold text-whisper/50">{t('points.badge_label')}</span>
                    </div>

                    {/* Award chips (staggered) */}
                    <div className="space-y-1.5">
                        {visibleAwards.map((award, i) => (
                            <AwardChip key={award.event_key + i} award={award} delay={i * 80} />
                        ))}
                    </div>

                    {/* Total points footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-[10px] text-whisper/35">{t('points.total_label')}</span>
                        <span className="flex items-center gap-1 text-xs font-bold text-moonbeam/70">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-ember/80">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                            <AnimatedCounter target={userPoints} />
                            &nbsp;{t('points.badge_label')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
