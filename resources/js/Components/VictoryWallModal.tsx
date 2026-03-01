/**
 * La Flamme — Victory Wall modal.
 * Lists recent community messages sorted by likes, allows posting + liking.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { VictoryMessage } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { PageProps } from '@/types';

// ─── CSRF helper ─────────────────────────────────────────────────────────────
function getCsrf(): string {
    const raw = document.cookie
        .split('; ')
        .find((r) => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('=') ?? '';
    return decodeURIComponent(raw);
}

function timeAgo(dateStr: string, locale: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return locale === 'fr' ? 'à l\'instant' : 'just now';
    if (diff < 3600) {
        const m = Math.floor(diff / 60);
        return locale === 'fr' ? `il y a ${m}min` : `${m}m ago`;
    }
    const h = Math.floor(diff / 3600);
    return locale === 'fr' ? `il y a ${h}h` : `${h}h ago`;
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div className="animate-pulse space-y-2 rounded-2xl border border-boundary/30 bg-surface/30 p-4">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-boundary/40" />
                <div className="h-3 w-24 rounded bg-boundary/40" />
            </div>
            <div className="h-3 w-full rounded bg-boundary/30" />
            <div className="h-3 w-3/4 rounded bg-boundary/30" />
        </div>
    );
}

// ─── Message card ─────────────────────────────────────────────────────────────
interface CardProps {
    msg: VictoryMessage;
    currentUserId: number;
    onLike: (id: number) => void;
    onDelete: (id: number) => void;
}

function MessageCard({ msg, currentUserId, onLike, onDelete }: CardProps) {
    const { locale } = useTranslation();
    const isOwn = msg.user.id === currentUserId;

    return (
        <div className="group rounded-2xl border border-boundary/30 bg-surface/20 p-4 transition-colors hover:border-boundary/50 hover:bg-surface/40">
            {/* Header */}
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/20 text-[10px] font-bold text-ember">
                        {msg.user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-xs font-semibold text-moonbeam/80">{msg.user.name}</span>
                    <span className="shrink-0 text-[10px] text-whisper/40">{timeAgo(msg.created_at, locale)}</span>
                </div>
                {isOwn && (
                    <button
                        type="button"
                        onClick={() => onDelete(msg.id)}
                        className="shrink-0 rounded p-0.5 text-whisper/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-boundary/30 hover:text-whisper/60"
                        title="Supprimer"
                    >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 3l10 10M13 3L3 13" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Content */}
            <p className="mb-3 text-sm leading-relaxed text-moonbeam/70">{msg.content}</p>

            {/* Like button */}
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => !isOwn && onLike(msg.id)}
                    disabled={isOwn}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                        isOwn
                            ? 'cursor-default text-whisper/25'
                            : msg.user_liked
                            ? 'bg-ember/15 text-ember hover:bg-ember/25'
                            : 'text-whisper/40 hover:bg-boundary/30 hover:text-whisper/70'
                    }`}
                >
                    <span>{msg.user_liked ? '❤️' : '🤍'}</span>
                    <span>{msg.likes_count}</span>
                </button>
            </div>
        </div>
    );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
interface Props {
    onClose: () => void;
}

export default function VictoryWallModal({ onClose }: Props) {
    const { locale } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;

    const [messages, setMessages] = useState<VictoryMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const MAX = 280;

    useEffect(() => {
        fetch(route('victory-messages.index'), {
            headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
        })
            .then((r) => r.json())
            .then((data: VictoryMessage[]) => setMessages(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handlePost = async () => {
        if (!content.trim() || posting) return;
        setPosting(true);
        setPostError(null);
        try {
            const res = await fetch(route('victory-messages.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
                body: JSON.stringify({ content: content.trim() }),
            });
            if (res.status === 422) {
                setPostError(locale === 'fr' ? 'Limite de 5 messages par jour atteinte.' : 'Daily limit of 5 messages reached.');
                return;
            }
            const newMsg: VictoryMessage = await res.json();
            setMessages((prev) => [newMsg, ...prev]);
            setContent('');
        } catch {
            // silent
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (id: number) => {
        // Optimistic update
        setMessages((prev) =>
            prev.map((m) =>
                m.id === id
                    ? {
                          ...m,
                          user_liked: !m.user_liked,
                          likes_count: m.user_liked ? m.likes_count - 1 : m.likes_count + 1,
                      }
                    : m,
            ),
        );
        try {
            const res = await fetch(route('victory-messages.like', { victoryMessage: id }), {
                method: 'POST',
                headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
            });
            const data: { liked: boolean; count: number } = await res.json();
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id ? { ...m, user_liked: data.liked, likes_count: data.count } : m,
                ),
            );
        } catch {
            // revert on error
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id
                        ? {
                              ...m,
                              user_liked: !m.user_liked,
                              likes_count: m.user_liked ? m.likes_count - 1 : m.likes_count + 1,
                          }
                        : m,
                ),
            );
        }
    };

    const handleDelete = async (id: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        try {
            await fetch(route('victory-messages.destroy', { victoryMessage: id }), {
                method: 'DELETE',
                headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
            });
        } catch {
            // silent — already removed from UI
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-void/80 backdrop-blur-sm sm:items-center"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-boundary bg-depth shadow-2xl shadow-black/70 sm:rounded-3xl"
                style={{ maxHeight: '85vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-boundary px-5 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">🔥</span>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-moonbeam">
                            {locale === 'fr' ? 'La Flamme' : 'The Flame'}
                        </h2>
                        <span className="text-[10px] text-whisper/40">
                            {locale === 'fr' ? '· victoires & encouragements' : '· victories & encouragement'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-whisper transition-colors hover:bg-surface hover:text-moonbeam"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 3l10 10M13 3L3 13" />
                        </svg>
                    </button>
                </div>

                {/* Compose */}
                <div className="shrink-0 border-b border-boundary/60 px-5 py-4">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => { setContent(e.target.value.slice(0, MAX)); setPostError(null); }}
                            rows={3}
                            placeholder={
                                locale === 'fr'
                                    ? 'Partage ta victoire du jour ou encourage la communauté…'
                                    : 'Share your win of the day or encourage the community…'
                            }
                            className="w-full resize-none rounded-xl border border-boundary bg-abyss px-3.5 py-2.5 text-sm text-moonbeam placeholder-whisper/30 focus:border-ember/60 focus:outline-none focus:ring-1 focus:ring-ember/20"
                        />
                        <span className={`absolute bottom-2.5 right-3 text-[10px] tabular-nums ${content.length >= MAX ? 'text-coral' : 'text-whisper/30'}`}>
                            {content.length}/{MAX}
                        </span>
                    </div>
                    {postError && (
                        <p className="mt-1.5 text-[11px] text-coral">{postError}</p>
                    )}
                    <div className="mt-2.5 flex justify-end">
                        <button
                            type="button"
                            onClick={handlePost}
                            disabled={!content.trim() || posting}
                            className="rounded-full bg-ember px-5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {posting
                                ? (locale === 'fr' ? 'Envoi…' : 'Posting…')
                                : (locale === 'fr' ? 'Publier 🔥' : 'Post 🔥')}
                        </button>
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                    {loading && (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    )}
                    {!loading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <span className="mb-3 text-4xl opacity-40">🔥</span>
                            <p className="text-sm text-whisper/50">
                                {locale === 'fr'
                                    ? 'Personne n\'a encore allumé la flamme.'
                                    : 'No one has lit the flame yet.'}
                            </p>
                            <p className="mt-1 text-xs text-whisper/30">
                                {locale === 'fr' ? 'Sois le premier !' : 'Be the first!'}
                            </p>
                        </div>
                    )}
                    {!loading &&
                        messages.map((msg) => (
                            <MessageCard
                                key={msg.id}
                                msg={msg}
                                currentUserId={currentUserId}
                                onLike={handleLike}
                                onDelete={handleDelete}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
