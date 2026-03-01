/**
 * VictoryInspireModal — shown after every 10th pomodoro.
 * Surfaces a top-liked community message to motivate the user.
 * Pattern: same animated entrance as LevelUpModal.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { VictoryMessage } from '@/types';
import { useEffect, useState } from 'react';

function getCsrf(): string {
    const raw = document.cookie
        .split('; ')
        .find((r) => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('=') ?? '';
    return decodeURIComponent(raw);
}

interface Props {
    message: VictoryMessage;
    onDismiss: () => void;
    onLiked: (updatedMsg: VictoryMessage) => void;
}

export default function VictoryInspireModal({ message, onDismiss, onLiked }: Props) {
    const { locale } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState<VictoryMessage>(message);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onDismiss, 350);
    };

    const handleLike = async () => {
        if (liking || msg.user_liked) return;
        setLiking(true);
        // Optimistic
        const updated = { ...msg, user_liked: true, likes_count: msg.likes_count + 1 };
        setMsg(updated);
        try {
            const res = await fetch(route('victory-messages.like', { victoryMessage: msg.id }), {
                method: 'POST',
                headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
            });
            const data: { liked: boolean; count: number } = await res.json();
            const final = { ...msg, user_liked: data.liked, likes_count: data.count };
            setMsg(final);
            onLiked(final);
        } catch {
            // revert
            setMsg(msg);
        } finally {
            setLiking(false);
        }
        handleDismiss();
    };

    return (
        <div
            className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-all duration-350 ${
                visible ? 'bg-black/75 backdrop-blur-sm' : 'bg-transparent'
            }`}
            onClick={handleDismiss}
        >
            <div
                className={`relative w-full max-w-xs overflow-hidden rounded-3xl border border-ember/30 bg-depth shadow-2xl shadow-black/70 transition-all duration-350 ${
                    visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top glowing strip */}
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-ember/60 to-transparent" />

                {/* Shimmer */}
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-ember/5 via-transparent to-ember/3" />

                <div className="flex flex-col items-center px-7 py-7 text-center">
                    {/* Badge */}
                    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-ember">
                        🔥 {locale === 'fr' ? 'La Flamme' : 'The Flame'}
                    </span>

                    {/* Label */}
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-whisper/40">
                        {locale === 'fr' ? 'Un message de la communauté' : 'A message from the community'}
                    </p>

                    {/* Message content */}
                    <blockquote className="mb-5 text-base font-medium leading-relaxed text-moonbeam">
                        "{msg.content}"
                    </blockquote>

                    {/* Author + likes */}
                    <div className="mb-6 flex items-center gap-2 text-xs text-whisper/50">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ember/20 text-[9px] font-bold text-ember">
                            {msg.user.name.charAt(0).toUpperCase()}
                        </span>
                        <span>{msg.user.name}</span>
                        <span className="text-whisper/30">·</span>
                        <span>❤️ {msg.likes_count}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full gap-2">
                        {!msg.user_liked ? (
                            <button
                                type="button"
                                onClick={handleLike}
                                disabled={liking}
                                className="flex-1 rounded-full border border-ember/40 bg-ember/10 py-2.5 text-xs font-semibold text-ember transition-all hover:bg-ember/20 active:scale-95 disabled:opacity-60"
                            >
                                ❤️ {locale === 'fr' ? 'Liker' : 'Like'}
                            </button>
                        ) : (
                            <div className="flex-1 rounded-full border border-ember/20 bg-ember/5 py-2.5 text-center text-xs font-semibold text-ember/60">
                                ❤️ {locale === 'fr' ? 'Liké !' : 'Liked!'}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="flex-1 rounded-full border border-boundary bg-surface/50 py-2.5 text-xs font-semibold text-whisper transition-all hover:border-whisper/40 hover:text-moonbeam active:scale-95"
                        >
                            {locale === 'fr' ? 'Continuer →' : 'Continue →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
