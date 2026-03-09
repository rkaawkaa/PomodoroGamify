import PlantAvatar from '@/Components/PlantAvatar';
import { useTranslation } from '@/hooks/useTranslation';
import { getLevelForPoints } from '@/data/levels';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Filters {
    project: number | null;
    category: number | null;
    period: 'today' | 'week' | 'month' | 'all';
}
interface ProjectItem  { id: number; name: string }
interface CategoryItem { id: number; name: string }
interface Overview {
    total_sessions: number;
    total_seconds: number;
    current_streak: number;
    best_streak: number;
    daily_avg: number;
}
interface ChartDay  { label: string; date: string; sessions: number; today: boolean }
interface ChartWeek { label: string; sessions: number; current: boolean }
interface HistorySession {
    id: number; ended_at: string; duration_seconds: number;
    project: { id: number; name: string } | null;
    categories: Array<{ id: number; name: string }>;
    tasks_count: number;
}
interface Paginated<T> {
    data: T[]; current_page: number; last_page: number; per_page: number; total: number;
}
interface LeaderboardEntry { id: number; name: string; points: number; sessions: number }
type Tab      = 'overview' | 'history' | 'leaderboard';
type LbPeriod = 'weekly' | 'monthly';

type Props = PageProps<{
    filters: Filters;
    projects: ProjectItem[];
    categories: CategoryItem[];
    overview: Overview;
    dailyChart: ChartDay[];
    weeklyChart: ChartWeek[];
    history: Paginated<HistorySession>;
    leaderboard: { weekly: LeaderboardEntry[]; monthly: LeaderboardEntry[] };
    userPoints: number;
    userId: number;
}>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSeconds(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function fmtHours(s: number): string { return (s / 3600).toFixed(1) + 'h'; }
function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
}
function fmtTime(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// ─── MiniBarChart ────────────────────────────────────────────────────────────

function MiniBarChart({
    data,
    color = 'var(--color-ember)',
}: {
    data: Array<{ label: string; sessions: number; highlighted?: boolean }>;
    color?: string;
}) {
    const max = Math.max(...data.map((d) => d.sessions), 1);
    const n   = data.length;
    const H   = 32; // chart height in viewBox units
    const G   = 1;  // gap
    const bw  = (100 - G * (n + 1)) / n;

    return (
        <svg viewBox={`0 0 100 ${H}`} className="h-full w-full" preserveAspectRatio="none">
            {data.map((d, i) => {
                const x   = G + i * (bw + G);
                const bh  = Math.max(1.5, (d.sessions / max) * H);
                const y   = H - bh;
                const hl  = d.highlighted ?? false;
                return (
                    <g key={i}>
                        <title>{`${d.label}: ${d.sessions}`}</title>
                        <rect
                            x={x} y={y} width={bw} height={bh}
                            rx={Math.min(1.2, bw / 3)}
                            fill={color}
                            fillOpacity={hl ? 0.9 : 0.3}
                        />
                    </g>
                );
            })}
        </svg>
    );
}

// ─── StatCell (for the horizontal stats strip) ───────────────────────────────

function StatCell({ label, value, accent }: { label: string; value: string; accent: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-3 text-center">
            <span className={`text-xl font-black tabular-nums leading-none ${accent}`}>{value}</span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-whisper/60">{label}</span>
        </div>
    );
}

// ─── LeaderRow ───────────────────────────────────────────────────────────────

function LeaderRow({ rank, entry, isCurrentUser }: { rank: number; entry: LeaderboardEntry; isCurrentUser: boolean }) {
    const { t } = useTranslation();
    const level = getLevelForPoints(entry.points);
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

    return (
        <div className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
            isCurrentUser ? 'border border-ember/20 bg-ember/6' : 'border border-transparent hover:bg-white/3'
        }`}>
            <div className="w-6 shrink-0 text-center">
                {medal
                    ? <span className="text-sm leading-none">{medal}</span>
                    : <span className="text-[11px] font-bold text-whisper/50">#{rank}</span>
                }
            </div>
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border ${level.borderColor} ${level.bgColor}`}>
                <PlantAvatar level={level.level} size={22} />
            </div>
            <div className="min-w-0 flex-1">
                <span className={`truncate text-[11px] font-semibold ${isCurrentUser ? 'text-ember' : 'text-moonbeam/80'}`}>
                    {entry.name}
                </span>
                {isCurrentUser && (
                    <span className="ml-1.5 text-[9px] font-bold text-ember/50">{t('stats.you')}</span>
                )}
                <div className={`text-[9px] ${level.color} opacity-80`}>nv.{level.level}</div>
            </div>
            <div className="shrink-0 text-right">
                <span className="text-sm font-black tabular-nums text-moonbeam/85">{entry.sessions}</span>
                <span className="ml-0.5 text-[9px] text-whisper/55">sess.</span>
            </div>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Stats({
    filters, projects, categories, overview,
    dailyChart, weeklyChart, history, leaderboard, userPoints, userId,
}: Props) {
    const { t } = useTranslation();
    const [tab, setTab]           = useState<Tab>('overview');
    const [lbPeriod, setLbPeriod] = useState<LbPeriod>('weekly');

    const applyFilter = (patch: Partial<Filters & { history_page?: number }>) => {
        router.get(route('stats'), { ...filters, history_page: history.current_page, ...patch }, {
            preserveState: true, replace: true, preserveScroll: true,
        });
    };

    const PERIODS = [
        { key: 'all',   label: t('stats.filter_period_all') },
        { key: 'today', label: t('stats.filter_period_today') },
        { key: 'week',  label: t('stats.filter_period_week') },
        { key: 'month', label: t('stats.filter_period_month') },
    ] as const;

    // Leaderboard
    const lbEntries  = leaderboard[lbPeriod];
    const myLbIndex  = lbEntries.findIndex((e) => e.id === userId);
    const myRank     = myLbIndex >= 0 ? myLbIndex + 1 : 0;
    const encourage  =
        lbEntries.length === 0 ? t('stats.lb_empty') :
        myRank === 0  ? t('stats.lb_not_ranked') :
        myRank === 1  ? t('stats.lb_encourage_1') :
        myRank <= 3   ? t('stats.lb_encourage_3') :
        myRank <= 10  ? t('stats.lb_encourage_10') :
                        t('stats.lb_encourage_other');

    return (
        <AuthenticatedLayout>
            <Head title={t('stats.page_title')} />

            <div className="mx-auto w-full max-w-4xl px-6 pb-16 pt-6">

                {/* ── Back + title ─────────────────────────────────────── */}
                <div className="mb-4 flex items-center gap-3">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-1.5 text-[11px] text-whisper/65 transition-colors hover:text-moonbeam"
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>
                    <span className="text-whisper/35">·</span>
                    <h1 className="text-sm font-bold tracking-tight text-moonbeam/80">
                        {t('stats.page_title')}
                    </h1>
                </div>

                {/* ── Filter bar ─────────────────────────────────────────── */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {/* Period pills */}
                    <div className="flex rounded-lg border border-white/8 bg-surface/30 p-0.5">
                        {PERIODS.map((p) => (
                            <button
                                key={p.key}
                                type="button"
                                onClick={() => applyFilter({ period: p.key, history_page: 1 })}
                                className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                                    filters.period === p.key
                                        ? 'bg-ember/80 text-white shadow'
                                        : 'text-whisper/65 hover:text-moonbeam'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Project + category selects */}
                    <select
                        value={filters.project ?? ''}
                        onChange={(e) => applyFilter({ project: e.target.value ? Number(e.target.value) : null, history_page: 1 })}
                        className="rounded-lg border border-white/8 bg-surface/30 px-2.5 py-1 text-[10px] text-whisper/60 focus:outline-none"
                    >
                        <option value="">{t('stats.filter_project')}</option>
                        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select
                        value={filters.category ?? ''}
                        onChange={(e) => applyFilter({ category: e.target.value ? Number(e.target.value) : null, history_page: 1 })}
                        className="rounded-lg border border-white/8 bg-surface/30 px-2.5 py-1 text-[10px] text-whisper/60 focus:outline-none"
                    >
                        <option value="">{t('stats.filter_category')}</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* ── Tabs ───────────────────────────────────────────────── */}
                <div className="mb-5 flex gap-0.5 rounded-lg border border-white/8 bg-surface/20 p-0.5">
                    {(['overview', 'history', 'leaderboard'] as Tab[]).map((t_) => (
                        <button
                            key={t_}
                            type="button"
                            onClick={() => setTab(t_)}
                            className={`flex-1 rounded-md py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                tab === t_
                                    ? 'bg-depth text-moonbeam shadow'
                                    : 'text-whisper/60 hover:text-moonbeam'
                            }`}
                        >
                            {t_ === 'overview'    && t('stats.tab_overview')}
                            {t_ === 'history'     && t('stats.tab_history')}
                            {t_ === 'leaderboard' && t('stats.tab_leaderboard')}
                        </button>
                    ))}
                </div>

                {/* ══ OVERVIEW ═══════════════════════════════════════════════ */}
                {tab === 'overview' && (
                    <div className="space-y-6">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                            <div className="rounded-xl border border-ember/30 bg-ember/10 p-5 text-center">
                                <div className="text-4xl font-black tabular-nums leading-none text-ember">{overview.total_sessions.toLocaleString()}</div>
                                <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-ember/60">{t('stats.kpi_sessions')}</div>
                            </div>
                            <div className="rounded-xl border border-bloom/30 bg-bloom/10 p-5 text-center">
                                <div className="text-4xl font-black tabular-nums leading-none text-bloom">{fmtHours(overview.total_seconds)}</div>
                                <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-bloom/60">{t('stats.kpi_focus')}</div>
                            </div>
                            <div className="rounded-xl border border-coral/30 bg-coral/10 p-5 text-center">
                                <div className="text-4xl font-black tabular-nums leading-none text-coral">{overview.current_streak}{t('stats.kpi_day')}</div>
                                <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-coral/60">{t('stats.kpi_streak_current')}</div>
                            </div>
                            <div className="rounded-xl border border-whisper/20 bg-whisper/5 p-5 text-center">
                                <div className="text-4xl font-black tabular-nums leading-none text-whisper/70">{overview.best_streak}{t('stats.kpi_day')}</div>
                                <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-whisper/50">{t('stats.kpi_streak_best')}</div>
                            </div>
                            <div className="rounded-xl border border-aurora/30 bg-aurora/10 p-5 text-center">
                                <div className="text-4xl font-black tabular-nums leading-none text-aurora">{String(overview.daily_avg)}</div>
                                <div className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-aurora/60">{t('stats.kpi_daily_avg')}</div>
                            </div>
                        </div>

                        {/* Charts side by side */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Daily */}
                            <div className="rounded-xl border border-ember/20 bg-surface/20 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ember/70">
                                        {t('stats.chart_14_days')}
                                    </span>
                                    {!dailyChart.every((d) => d.sessions === 0) && (
                                        <span className="text-[10px] tabular-nums text-ember/50">
                                            {Math.max(...dailyChart.map(d => d.sessions))} max
                                        </span>
                                    )}
                                </div>
                                {dailyChart.every((d) => d.sessions === 0) ? (
                                    <p className="py-16 text-center text-[11px] text-whisper/50">{t('stats.no_data')}</p>
                                ) : (
                                    <div className="h-44">
                                        <MiniBarChart
                                            data={dailyChart.map((d) => ({
                                                label: d.label,
                                                sessions: d.sessions,
                                                highlighted: d.today,
                                            }))}
                                        />
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-[9px] text-whisper/55">
                                    <span>{dailyChart[0]?.label}</span>
                                    <span>{dailyChart[dailyChart.length - 1]?.label}</span>
                                </div>
                            </div>

                            {/* Weekly */}
                            <div className="rounded-xl border border-bloom/20 bg-surface/20 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-bloom/70">
                                        {t('stats.chart_8_weeks')}
                                    </span>
                                    {!weeklyChart.every((w) => w.sessions === 0) && (
                                        <span className="text-[10px] tabular-nums text-bloom/50">
                                            {Math.max(...weeklyChart.map(w => w.sessions))} max
                                        </span>
                                    )}
                                </div>
                                {weeklyChart.every((w) => w.sessions === 0) ? (
                                    <p className="py-16 text-center text-[11px] text-whisper/50">{t('stats.no_data')}</p>
                                ) : (
                                    <div className="h-44">
                                        <MiniBarChart
                                            data={weeklyChart.map((w) => ({
                                                label: w.label,
                                                sessions: w.sessions,
                                                highlighted: w.current,
                                            }))}
                                            color="var(--color-bloom)"
                                        />
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-[9px] text-whisper/55">
                                    <span>{weeklyChart[0]?.label}</span>
                                    <span>{weeklyChart[weeklyChart.length - 1]?.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ HISTORY ════════════════════════════════════════════════ */}
                {tab === 'history' && (
                    <div className="space-y-2">
                        <div className="overflow-hidden rounded-xl border border-white/8 bg-surface/20">
                            {history.data.length === 0 ? (
                                <p className="py-10 text-center text-xs text-whisper/55">{t('stats.history_empty')}</p>
                            ) : (
                                history.data.map((s) => <HistoryRow key={s.id} session={s} t={t} />)
                            )}
                        </div>
                        {history.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    disabled={history.current_page <= 1}
                                    onClick={() => applyFilter({ history_page: history.current_page - 1 })}
                                    className="rounded-lg border border-white/8 bg-surface/20 px-3 py-1.5 text-[10px] text-whisper/65 transition-colors hover:text-moonbeam disabled:opacity-25"
                                >← {t('stats.history_prev')}</button>
                                <span className="text-[10px] text-whisper/55">
                                    {t('stats.history_page').replace(':cur', String(history.current_page)).replace(':last', String(history.last_page))}
                                </span>
                                <button
                                    type="button"
                                    disabled={history.current_page >= history.last_page}
                                    onClick={() => applyFilter({ history_page: history.current_page + 1 })}
                                    className="rounded-lg border border-white/8 bg-surface/20 px-3 py-1.5 text-[10px] text-whisper/65 transition-colors hover:text-moonbeam disabled:opacity-25"
                                >{t('stats.history_next')} →</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ LEADERBOARD ════════════════════════════════════════════ */}
                {tab === 'leaderboard' && (
                    <div className="space-y-3">
                        {/* Period toggle + rank bubble */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex rounded-lg border border-white/8 bg-surface/20 p-0.5">
                                {(['weekly', 'monthly'] as LbPeriod[]).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setLbPeriod(p)}
                                        className={`rounded-md px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                                            lbPeriod === p ? 'bg-depth text-moonbeam shadow' : 'text-whisper/60 hover:text-moonbeam'
                                        }`}
                                    >
                                        {p === 'weekly' ? t('stats.lb_weekly') : t('stats.lb_monthly')}
                                    </button>
                                ))}
                            </div>
                            {myRank > 0 && (
                                <span className="rounded-full border border-ember/20 bg-ember/8 px-3 py-1 text-[10px] font-bold text-ember">
                                    #{myRank} {t('stats.lb_your_rank')}
                                </span>
                            )}
                        </div>

                        {/* Encouragement */}
                        <div className="rounded-lg border border-bloom/12 bg-bloom/6 px-3 py-2 text-[11px] text-bloom/70">
                            {encourage}
                        </div>

                        {/* Rankings */}
                        <div className="overflow-hidden rounded-xl border border-white/8 bg-surface/20 p-1.5">
                            {lbEntries.length === 0 ? (
                                <p className="py-8 text-center text-xs text-whisper/55">{t('stats.lb_empty')}</p>
                            ) : (
                                <div className="space-y-0.5">
                                    {lbEntries.slice(0, 10).map((entry, i) => (
                                        <LeaderRow
                                            key={entry.id}
                                            rank={i + 1}
                                            entry={entry}
                                            isCurrentUser={entry.id === userId}
                                        />
                                    ))}
                                    {myRank > 10 && myLbIndex >= 0 && (
                                        <>
                                            <div className="py-0.5 text-center text-[10px] text-whisper/45">· · ·</div>
                                            {lbEntries
                                                .slice(Math.max(10, myLbIndex - 2), Math.min(lbEntries.length, myLbIndex + 3))
                                                .map((entry, i) => (
                                                    <LeaderRow
                                                        key={entry.id}
                                                        rank={Math.max(10, myLbIndex - 2) + i + 1}
                                                        entry={entry}
                                                        isCurrentUser={entry.id === userId}
                                                    />
                                                ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {myRank === 0 && lbEntries.length > 0 && (
                            <p className="text-center text-[11px] text-whisper/55">{t('stats.lb_not_ranked')}</p>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// ─── HistoryRow (outside main for cleanliness) ───────────────────────────────

function HistoryRow({ session, t }: { session: HistorySession; t: (k: string) => string }) {
    return (
        <div className="flex items-center gap-3 border-b border-white/5 px-3 py-2.5 last:border-0">
            {/* Date/time */}
            <div className="w-16 shrink-0 text-right">
                <div className="text-[10px] font-semibold text-moonbeam/80">{fmtDate(session.ended_at)}</div>
                <div className="text-[9px] text-whisper/55">{fmtTime(session.ended_at)}</div>
            </div>

            {/* Tags */}
            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap gap-1">
                    <span className="inline-flex rounded-full border border-aurora/20 bg-aurora/8 px-1.5 py-0.5 text-[9px] font-medium text-aurora/70">
                        {session.project?.name ?? t('stats.history_no_project')}
                    </span>
                    {session.categories.map((c) => (
                        <span key={c.id} className="inline-flex rounded-full border border-bloom/15 bg-bloom/6 px-1.5 py-0.5 text-[9px] text-bloom/60">
                            {c.name}
                        </span>
                    ))}
                </div>
                {session.tasks_count > 0 && (
                    <div className="text-[9px] text-whisper/55">
                        ✓ {session.tasks_count} {session.tasks_count === 1
                            ? t('stats.history_tasks').split('|')[0]
                            : t('stats.history_tasks').split('|')[1]}
                    </div>
                )}
            </div>

            {/* Duration */}
            <span className="shrink-0 font-mono text-[11px] font-bold text-ember/80">
                {fmtSeconds(session.duration_seconds)}
            </span>
        </div>
    );
}
