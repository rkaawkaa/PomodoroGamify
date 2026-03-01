/**
 * SocialProof — ambient social indicator.
 * Shows active user count + recent community activity.
 *
 * compact=true  → single-line strip (for Dashboard sidebar/footer)
 * showCta=true  → register CTA always visible, never dismissible
 *
 * The activity feed is dismissible per browser session (resets on reload).
 */
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'pomobloom_sp_dismissed';

interface FeedItem {
    name: string;
    label: string | null;
    mins_ago: number;
}

interface SocialProofData {
    active_count: number;
    feed: FeedItem[];
}

function timeLabel(minsAgo: number, locale: string): string {
    if (minsAgo < 60) return locale === 'fr' ? `il y a ${minsAgo}min` : `${minsAgo}m ago`;
    const h = Math.floor(minsAgo / 60);
    return locale === 'fr' ? `il y a ${h}h` : `${h}h ago`;
}

function workingOn(locale: string): string {
    return locale === 'fr' ? 'travaille sur' : 'is working on';
}

const DismissIcon = () => (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 1l8 8M9 1L1 9" />
    </svg>
);

interface Props {
    compact?: boolean;
    showCta?: boolean;
}

export default function SocialProof({ compact = false, showCta = false }: Props) {
    const { locale } = useTranslation();
    const [data, setData] = useState<SocialProofData | null>(null);
    // Session-only: resets on every page reload
    const [feedDismissed, setFeedDismissed] = useState(() => {
        try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
    });

    useEffect(() => {
        if (feedDismissed) return;
        fetch(route('social-proof'), { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then(setData)
            .catch(() => {});
    }, [feedDismissed]);

    const handleDismiss = () => {
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* silent */ }
        setFeedDismissed(true);
    };

    // ── CTA block (never dismissible) ──────────────────────────────────────
    const ctaBlock = showCta ? (
        <div className="w-full max-w-xs rounded-2xl border border-ember/20 bg-ember/5 px-4 py-3 text-center">
            <p className="mb-2.5 text-[10px] leading-relaxed text-whisper/50">
                {locale === 'fr'
                    ? 'Rejoins-les ! Crée un compte gratuit pour sauvegarder tes sessions, gérer projets & catégories et suivre ta progression.'
                    : 'Join them! Create a free account to save your sessions, manage projects & categories, and track your progress.'}
            </p>
            <Link
                href={route('register')}
                className="inline-block rounded-full bg-ember px-5 py-1.5 text-[10px] font-semibold text-white transition-all hover:brightness-110"
            >
                {locale === 'fr' ? 'Créer un compte gratuit →' : 'Create a free account →'}
            </Link>
        </div>
    ) : null;

    // ── Compact mode ────────────────────────────────────────────────────────
    if (compact) {
        if (feedDismissed || !data) return null;
        const first = data.feed[0];
        return (
            <div className="flex items-center gap-2 text-[10px] text-whisper/40">
                <span className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                    </span>
                    <span>{data.active_count} {locale === 'fr' ? 'actifs' : 'active'}</span>
                </span>
                {first && (
                    <>
                        <span className="text-whisper/20">·</span>
                        <span className="truncate">
                            {first.name}
                            {first.label ? ` ${workingOn(locale)} ${first.label}` : ''}
                            {' · '}{timeLabel(first.mins_ago, locale)}
                        </span>
                    </>
                )}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="ml-auto shrink-0 text-whisper/20 transition-colors hover:text-whisper/50"
                    title={locale === 'fr' ? 'Masquer' : 'Dismiss'}
                >
                    <DismissIcon />
                </button>
            </div>
        );
    }

    // ── Full mode: feed dismissed ───────────────────────────────────────────
    if (feedDismissed) return ctaBlock;

    // ── Full mode: loading ──────────────────────────────────────────────────
    if (!data) return ctaBlock; // show CTA even before data loads

    // ── Full mode ───────────────────────────────────────────────────────────
    return (
        <div className="flex w-full max-w-xs flex-col gap-2.5">
            <div className="relative space-y-2.5">
                {/* Dismiss button (feed only) */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-whisper/25 transition-colors hover:bg-surface/40 hover:text-whisper/60"
                    title={locale === 'fr' ? 'Masquer' : 'Dismiss'}
                >
                    <DismissIcon />
                </button>

                {/* Active count badge */}
                <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                    </span>
                    <span className="text-[11px] font-medium text-whisper/60">
                        {locale === 'fr'
                            ? `${data.active_count} utilisateurs actifs en ce moment`
                            : `${data.active_count} users active right now`}
                    </span>
                </div>

                {/* Activity feed */}
                <div className="space-y-1.5">
                    {data.feed.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 rounded-xl border border-boundary/25 bg-surface/15 px-3 py-1.5"
                        >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15 text-[9px] font-bold text-ember">
                                {item.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[10px] text-whisper/50">
                                <span className="font-medium text-whisper/70">{item.name}</span>
                                {item.label && (
                                    <>
                                        {' '}{workingOn(locale)}{' '}
                                        <span className="text-ember/60">{item.label}</span>
                                    </>
                                )}
                            </span>
                            <span className="shrink-0 text-[9px] text-whisper/30">
                                {timeLabel(item.mins_ago, locale)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA — always visible, not affected by feed dismiss */}
            {ctaBlock}
        </div>
    );
}
