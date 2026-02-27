import PlantAvatar from '@/Components/PlantAvatar';
import { useTranslation } from '@/hooks/useTranslation';
import { getLevelForPoints, getLevelProgress, getNextLevel, LEVELS } from '@/data/levels';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Props = PageProps<{
    userPoints: number;
}>;

export default function PlayerProfile({ userPoints }: Props) {
    const { t } = useTranslation();

    const level = getLevelForPoints(userPoints);
    const next = getNextLevel(level);
    const progress = getLevelProgress(userPoints);
    const isMaxLevel = !next;
    const ptsToNext    = next ? next.minPoints - userPoints : 0;
    const rangeTotal   = next ? next.minPoints - level.minPoints : 0;
    const rangeEarned  = next ? userPoints - level.minPoints : 0;

    return (
        <AuthenticatedLayout>
            <Head title={t('player.title')} />

            <div className="flex flex-1 flex-col items-center bg-gradient-to-b from-ember/[0.10] via-abyss to-bloom/[0.06] px-4 pt-10 pb-20">

                {/* Back link */}
                <div className="mb-6 w-full max-w-sm">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-1.5 text-xs font-medium text-whisper/50 transition-colors hover:text-moonbeam"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>
                </div>

                {/* Profile card */}
                <div className={`relative w-full max-w-sm overflow-hidden rounded-3xl border-2 shadow-2xl shadow-black/80 ${level.borderColor}`}
                    style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-depth) 60%, var(--color-abyss) 100%)' }}
                >
                    {/* Colored glow strip at top */}
                    <div className={`h-1 w-full ${level.bgColor.replace('/10', '')} opacity-70`}
                        style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
                    />
                    {/* Inline glow line fallback */}
                    <div className={`-mt-1 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent ${level.color} opacity-60`}/>

                    {/* Ambient shimmer */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-white/2"/>

                    <div className="flex flex-col items-center px-8 pt-8 pb-6">

                        {/* Level badge */}
                        <span className={`mb-5 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] shadow-lg ${level.color} ${level.borderColor} ${level.bgColor}`}>
                            ✦ {t('player.level')} {level.level} ✦
                        </span>

                        {/* Avatar with glow ring */}
                        <div className={`relative mb-5 rounded-full border-2 p-3 shadow-xl ${level.borderColor} ${level.bgColor}`}>
                            <PlantAvatar level={level.level} size={108} />
                        </div>

                        {/* Title */}
                        <h1 className="mb-0.5 text-2xl font-black tracking-tight text-moonbeam">
                            {t(`level.${level.level}`)}
                        </h1>
                        <p className={`mb-5 text-xs font-semibold uppercase tracking-widest ${level.color} opacity-80`}>
                            {t('player.level')} {level.level}
                        </p>

                        {/* Points display */}
                        <div className={`mb-6 flex items-center gap-2 rounded-2xl border px-5 py-3 ${level.borderColor} ${level.bgColor}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={level.color}>
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                            </svg>
                            <span className="text-xl font-black tabular-nums text-moonbeam">
                                {userPoints.toLocaleString()}
                            </span>
                            <span className="text-sm font-semibold text-whisper/70">{t('points.badge_label')}</span>
                        </div>

                        {/* Progress bar to next level */}
                        <div className="w-full">
                            {!isMaxLevel ? (
                                <>
                                    {/* Header: label + % */}
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-whisper/70">
                                            {t('player.progress_label').replace(':n', String(next!.level))}
                                        </span>
                                        <span className={`text-xs font-black tabular-nums ${level.color}`}>
                                            {Math.round(progress * 100)}%
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mb-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/8">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${level.bgColor.replace('/10', '/80')}`}
                                            style={{ width: `${progress * 100}%` }}
                                        />
                                    </div>

                                    {/* Range info: earned / total  ·  X pts remaining */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-whisper/45">
                                            {rangeEarned.toLocaleString()}
                                            <span className="text-whisper/25"> / {rangeTotal.toLocaleString()} pts</span>
                                        </span>
                                        <span className={`text-[11px] font-bold tabular-nums ${level.color}`}>
                                            {t('player.pts_remaining').replace(':n', ptsToNext.toLocaleString())}
                                        </span>
                                    </div>

                                    {/* Next level total threshold */}
                                    <div className="mt-1.5 text-center text-[10px] text-whisper/30">
                                        {t('player.next_level_label')} {next!.level} — {next!.minPoints.toLocaleString()} pts
                                    </div>
                                </>
                            ) : (
                                <div className={`rounded-2xl border-2 py-3 text-center text-sm font-black tracking-wide ${level.color} ${level.borderColor} ${level.bgColor}`}>
                                    🌟 {t('player.max_level')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* All levels reference */}
                    <div className="border-t border-white/10 px-6 py-5">
                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-whisper/60">
                            {t('player.level')}s
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {LEVELS.map((lvl) => {
                                const isUnlocked = userPoints >= lvl.minPoints;
                                const isCurrent = lvl.level === level.level;
                                return (
                                    <div
                                        key={lvl.level}
                                        className={`flex flex-col items-center gap-1 rounded-xl border py-2 transition-all ${
                                            isCurrent
                                                ? `border-2 ${lvl.borderColor} ${lvl.bgColor} shadow-lg`
                                                : isUnlocked
                                                ? 'border-white/15 bg-white/8'
                                                : 'border-white/5 bg-white/2 opacity-35'
                                        }`}
                                        title={`${t('player.level')} ${lvl.level} — ${t(`level.${lvl.level}`)} (${lvl.minPoints.toLocaleString()} pts)`}
                                    >
                                        <PlantAvatar level={lvl.level} size={30} />
                                        <span className={`text-[10px] font-bold tabular-nums ${
                                            isCurrent ? lvl.color : isUnlocked ? 'text-moonbeam/70' : 'text-whisper/50'
                                        }`}>
                                            {lvl.level}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
