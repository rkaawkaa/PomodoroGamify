import PlantAvatar from '@/Components/PlantAvatar';
import { useTranslation } from '@/hooks/useTranslation';
import { Level, getNextLevel } from '@/data/levels';
import { useEffect, useState } from 'react';

interface Props {
    level: Level;
    onDismiss: () => void;
}

export default function LevelUpModal({ level, onDismiss }: Props) {
    const { t } = useTranslation();
    const next = getNextLevel(level);
    const [visible, setVisible] = useState(false);

    // Stagger entrance for a dramatic reveal
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onDismiss, 350);
    };

    return (
        /* Backdrop */
        <div
            className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-all duration-350 ${
                visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'
            }`}
            onClick={handleDismiss}
        >
            {/* Card — stop propagation so clicks on card don't also close */}
            <div
                className={`relative w-full max-w-xs overflow-hidden rounded-3xl border shadow-2xl shadow-black/70 transition-all duration-350 ${
                    visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                } ${level.borderColor} ${level.bgColor} bg-depth`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Glowing top strip */}
                <div className={`h-0.5 w-full ${level.bgColor.replace('/10', '/80')} bg-gradient-to-r from-transparent via-current to-transparent`}/>

                {/* Shimmer background */}
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-white/3 via-transparent to-white/2"/>

                <div className="flex flex-col items-center px-8 py-8">
                    {/* LEVEL UP badge */}
                    <span className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${level.color} ${level.borderColor} ${level.bgColor}`}>
                        ✨ {t('levelup.title')} ✨
                    </span>

                    {/* Avatar — large */}
                    <div className={`mb-4 rounded-full border-2 p-2 ${level.borderColor} ${level.bgColor}`}>
                        <PlantAvatar level={level.level} size={88} />
                    </div>

                    {/* Level number */}
                    <div className={`mb-1 font-mono text-5xl font-black tabular-nums leading-none ${level.color}`}>
                        {t('player.level')} {level.level}
                    </div>

                    {/* Title */}
                    <div className="mb-4 text-sm font-semibold text-moonbeam/80">
                        {t(`level.${level.level}`)}
                    </div>

                    {/* Congratulation message */}
                    <p className="mb-6 text-center text-xs leading-relaxed text-whisper/60">
                        {t('levelup.desc')}
                        {next && (
                            <><br /><span className="text-whisper/40">{t('player.next_level_label')} : {t(`level.${next.level}`)}</span></>
                        )}
                        {!next && (
                            <><br /><span className={`${level.color}`}>{t('player.max_level')}</span></>
                        )}
                    </p>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className={`rounded-full border px-10 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 ${level.color} ${level.borderColor} ${level.bgColor}`}
                    >
                        {t('levelup.continue')} →
                    </button>
                </div>
            </div>
        </div>
    );
}
