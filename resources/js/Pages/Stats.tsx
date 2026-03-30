import PlantAvatar from '@/Components/PlantAvatar';
import { useTranslation } from '@/hooks/useTranslation';
import { getLevelForPoints } from '@/data/levels';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Filters {
    project: number | null;
    category: number | null;
    period: 'today' | 'week' | 'month' | 'all';
    source: 'all' | 'real' | 'declared';
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
    id: number; ended_at: string; duration_seconds: number; is_declared: boolean;
    project: { id: number; name: string } | null;
    categories: Array<{ id: number; name: string }>;
    tasks: Array<{ id: number; title: string; done: boolean }>;
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
    return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
}
function fmtTime(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// ─── FilterSelect ────────────────────────────────────────────────────────────

function FilterSelect({
    value,
    onChange,
    options,
    placeholder,
    accentColor = 'ember',
}: {
    value: string;
    onChange: (v: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    accentColor?: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const activeClass =
        accentColor === 'aurora'
            ? 'border-aurora/40 bg-aurora/12 text-aurora'
            : 'border-ember/40 bg-ember/12 text-ember';

    const dotClass =
        accentColor === 'aurora'
            ? 'bg-aurora'
            : 'bg-ember';

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium transition-all ${
                    selected
                        ? activeClass
                        : 'border-white/10 bg-depth/70 text-whisper/70 hover:border-white/20 hover:text-moonbeam'
                }`}
            >
                {selected && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />}
                <span className="max-w-[120px] truncate">{selected?.label ?? placeholder}</span>
                {selected ? (
                    <span
                        onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false); }}
                        className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
                    >
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
                        </svg>
                    </span>
                ) : (
                    <svg
                        className={`h-3 w-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M2 3.5l3 3 3-3"/>
                    </svg>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-2xl border border-boundary/60 bg-depth shadow-2xl shadow-black/30">
                    <div className="max-h-56 overflow-y-auto p-1.5">
                        {options.map((o) => (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => { onChange(o.value); setOpen(false); }}
                                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[11px] font-medium transition-colors ${
                                    value === o.value
                                        ? (accentColor === 'aurora' ? 'bg-aurora/15 text-aurora' : 'bg-ember/15 text-ember')
                                        : 'text-moonbeam/80 hover:bg-surface/60'
                                }`}
                            >
                                {value === o.value && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />}
                                {value !== o.value && <span className="h-1.5 w-1.5 shrink-0" />}
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── BarChart ────────────────────────────────────────────────────────────────

function BarChart({
    data,
    color = 'var(--color-ember)',
    highlightColor,
    gradId = 'a',
}: {
    data: Array<{ label: string; sessions: number; highlighted?: boolean }>;
    color?: string;
    highlightColor?: string;
    gradId?: string;
}) {
    const max = Math.max(...data.map((d) => d.sessions), 1);
    const n   = data.length;
    const H   = 90;
    const G   = 1.5;
    const bw  = (100 - G * (n + 1)) / n;
    const hc  = highlightColor ?? color;
    const mainId = `grad-main-${gradId}`;
    const hlId   = `grad-hl-${gradId}`;
    const glowId = `glow-${gradId}`;

    return (
        <svg viewBox={`0 0 100 ${H}`} className="h-full w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={mainId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id={hlId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={hc} stopOpacity="1" />
                    <stop offset="100%" stopColor={hc} stopOpacity="0.45" />
                </linearGradient>
                <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Grid lines */}
            {[0.33, 0.66].map((f, i) => (
                <line key={i} x1="0" y1={H * f} x2="100" y2={H * f}
                    stroke="white" strokeOpacity="0.05" strokeWidth="0.5" strokeDasharray="2 2" />
            ))}

            {data.map((d, i) => {
                const x  = G + i * (bw + G);
                const bh = Math.max(2.5, (d.sessions / max) * (H - 10));
                const y  = H - bh;
                const hl = d.highlighted ?? false;
                const showLabel = d.sessions > 0 && bh > 15;

                return (
                    <g key={i}>
                        <title>{`${d.label}: ${d.sessions}`}</title>
                        {/* Glow for highlighted */}
                        {hl && (
                            <rect x={x} y={y} width={bw} height={bh}
                                rx={Math.min(2, bw / 4)}
                                fill={hc} fillOpacity="0.25"
                                filter={`url(#${glowId})`}
                            />
                        )}
                        <rect x={x} y={y} width={bw} height={bh}
                            rx={Math.min(2, bw / 4)}
                            fill={hl ? `url(#${hlId})` : `url(#${mainId})`}
                        />
                        {/* Value label on top of bar */}
                        {showLabel && (
                            <text
                                x={x + bw / 2} y={y - 2}
                                textAnchor="middle"
                                fontSize="4.5"
                                fill={hl ? hc : color}
                                fillOpacity={hl ? 1 : 0.7}
                            >
                                {d.sessions}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────

function KpiCard({
    value, label, colorClass, fromClass, toClass, borderClass, glowStyle, icon,
}: {
    value: string;
    label: string;
    colorClass: string;
    fromClass: string;
    toClass: string;
    borderClass: string;
    glowStyle: React.CSSProperties;
    icon: React.ReactNode;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-5 ${borderClass}`}
            style={{
                background: `linear-gradient(135deg, var(--from-color, transparent) 0%, transparent 100%)`,
                ...glowStyle,
            }}
        >
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 ${fromClass} ${toClass} opacity-100`} style={{ background: 'inherit' }} />
            <div className={`absolute inset-0 rounded-2xl ${fromClass}`} style={{ opacity: 0 }} />

            {/* Actual content (above gradient) */}
            <div className="relative">
                <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${colorClass} opacity-75`}>
                    {icon}
                </div>
                <div className={`text-3xl font-black tabular-nums leading-none ${colorClass}`}>{value}</div>
                <div className={`mt-1.5 text-[10px] font-bold uppercase tracking-widest ${colorClass} opacity-60`}>{label}</div>
            </div>
        </div>
    );
}

// ─── LeaderRow ───────────────────────────────────────────────────────────────

function LeaderRow({ rank, entry, isCurrentUser }: { rank: number; entry: LeaderboardEntry; isCurrentUser: boolean }) {
    const { t } = useTranslation();
    const level = getLevelForPoints(entry.points);
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

    return (
        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
            isCurrentUser
                ? 'border border-ember/25 bg-ember/8'
                : rank <= 3
                    ? 'border border-white/6 bg-white/3'
                    : 'border border-transparent hover:bg-white/3'
        }`}>
            <div className="w-7 shrink-0 text-center">
                {medal
                    ? <span className="text-base leading-none">{medal}</span>
                    : <span className="text-[11px] font-bold text-whisper/45">#{rank}</span>
                }
            </div>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border ${level.borderColor} ${level.bgColor}`}>
                <PlantAvatar level={level.level} size={24} />
            </div>
            <div className="min-w-0 flex-1">
                <div className={`truncate text-[12px] font-semibold ${isCurrentUser ? 'text-ember' : 'text-moonbeam/85'}`}>
                    {entry.name}
                    {isCurrentUser && <span className="ml-1.5 text-[9px] font-bold text-ember/50">{t('stats.you')}</span>}
                </div>
                <div className={`text-[10px] ${level.color} opacity-70`}>Niv. {level.level}</div>
            </div>
            <div className="shrink-0 text-right">
                <span className="text-sm font-black tabular-nums text-moonbeam/80">{entry.sessions}</span>
                <span className="ml-0.5 text-[9px] text-whisper/50">sess.</span>
            </div>
        </div>
    );
}

// ─── KPI config ──────────────────────────────────────────────────────────────

const KPI_CONFIGS = [
    {
        colorClass: 'text-ember',
        border: 'border-ember/25',
        bg: 'bg-ember/12',
        shadow: { boxShadow: '0 4px 32px -6px hsl(var(--ember) / 0.25)' } as React.CSSProperties,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
    },
    {
        colorClass: 'text-bloom',
        border: 'border-bloom/25',
        bg: 'bg-bloom/12',
        shadow: { boxShadow: '0 4px 32px -6px hsl(var(--bloom) / 0.25)' } as React.CSSProperties,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
        ),
    },
    {
        colorClass: 'text-coral',
        border: 'border-coral/25',
        bg: 'bg-coral/12',
        shadow: { boxShadow: '0 4px 32px -6px hsl(var(--coral) / 0.25)' } as React.CSSProperties,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
        ),
    },
    {
        colorClass: 'text-sunbeam',
        border: 'border-sunbeam/25',
        bg: 'bg-sunbeam/10',
        shadow: { boxShadow: '0 4px 32px -6px hsl(var(--sunbeam) / 0.2)' } as React.CSSProperties,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        ),
    },
    {
        colorClass: 'text-aurora',
        border: 'border-aurora/25',
        bg: 'bg-aurora/12',
        shadow: { boxShadow: '0 4px 32px -6px hsl(var(--aurora) / 0.25)' } as React.CSSProperties,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
        ),
    },
];

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

    const lbEntries = leaderboard[lbPeriod];
    const myLbIndex = lbEntries.findIndex((e) => e.id === userId);
    const myRank    = myLbIndex >= 0 ? myLbIndex + 1 : 0;
    const encourage =
        lbEntries.length === 0 ? t('stats.lb_empty') :
        myRank === 0  ? t('stats.lb_not_ranked') :
        myRank === 1  ? t('stats.lb_encourage_1') :
        myRank <= 3   ? t('stats.lb_encourage_3') :
        myRank <= 10  ? t('stats.lb_encourage_10') :
                        t('stats.lb_encourage_other');

    const TAB_LABELS: Record<Tab, string> = {
        overview:    t('stats.tab_overview'),
        history:     t('stats.tab_history'),
        leaderboard: t('stats.tab_leaderboard'),
    };

    const kpiValues = [
        overview.total_sessions.toLocaleString(),
        fmtHours(overview.total_seconds),
        `${overview.current_streak}${t('stats.kpi_day')}`,
        `${overview.best_streak}${t('stats.kpi_day')}`,
        String(overview.daily_avg),
    ];
    const kpiLabels = [
        t('stats.kpi_sessions'),
        t('stats.kpi_focus'),
        t('stats.kpi_streak_current'),
        t('stats.kpi_streak_best'),
        t('stats.kpi_daily_avg'),
    ];

    const projectOptions  = projects.map((p) => ({ value: String(p.id), label: p.name }));
    const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

    return (
        <AuthenticatedLayout>
            <Head title={t('stats.page_title')} />

            <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">

                {/* ── Back + title ─────────────────────────────────────── */}
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        href={route('dashboard')}
                        className="flex items-center gap-1.5 text-[11px] text-whisper/55 transition-colors hover:text-moonbeam"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        {t('common.back')}
                    </Link>
                    <span className="text-whisper/25">·</span>
                    <h1 className="text-base font-bold tracking-tight text-moonbeam">
                        {t('stats.page_title')}
                    </h1>
                </div>

                {/* ── Filter bar ─────────────────────────────────────────── */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    {/* Period pills */}
                    <div className="flex rounded-xl border border-white/10 bg-depth/60 p-1">
                        {PERIODS.map((p) => (
                            <button
                                key={p.key}
                                type="button"
                                onClick={() => applyFilter({ period: p.key, history_page: 1 })}
                                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                                    filters.period === p.key
                                        ? 'bg-ember/80 text-white shadow-sm'
                                        : 'text-whisper/60 hover:text-moonbeam'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Source pills */}
                    <div className="flex rounded-xl border border-white/10 bg-depth/60 p-1">
                        {([
                            { key: 'all',      label: t('stats.source_all') },
                            { key: 'real',     label: t('stats.source_real') },
                            { key: 'declared', label: t('stats.source_declared') },
                        ] as const).map((s) => (
                            <button
                                key={s.key}
                                type="button"
                                onClick={() => applyFilter({ source: s.key, history_page: 1 })}
                                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                                    filters.source === s.key
                                        ? 'bg-aurora/70 text-white shadow-sm'
                                        : 'text-whisper/60 hover:text-moonbeam'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Custom project select */}
                    <FilterSelect
                        value={filters.project ? String(filters.project) : ''}
                        onChange={(v) => applyFilter({ project: v ? Number(v) : null, history_page: 1 })}
                        options={projectOptions}
                        placeholder={t('stats.filter_project')}
                        accentColor="aurora"
                    />

                    {/* Custom category select */}
                    <FilterSelect
                        value={filters.category ? String(filters.category) : ''}
                        onChange={(v) => applyFilter({ category: v ? Number(v) : null, history_page: 1 })}
                        options={categoryOptions}
                        placeholder={t('stats.filter_category')}
                        accentColor="ember"
                    />
                </div>

                {/* ── Tabs ───────────────────────────────────────────────── */}
                <div className="mb-6 flex gap-1 rounded-2xl border border-white/8 bg-depth/40 p-1.5">
                    {(['overview', 'history', 'leaderboard'] as Tab[]).map((t_) => (
                        <button
                            key={t_}
                            type="button"
                            onClick={() => setTab(t_)}
                            className={`flex-1 rounded-xl py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                                tab === t_
                                    ? 'bg-surface text-moonbeam shadow-sm'
                                    : 'text-whisper/50 hover:text-moonbeam'
                            }`}
                        >
                            {TAB_LABELS[t_]}
                        </button>
                    ))}
                </div>

                {/* ══ OVERVIEW ═══════════════════════════════════════════════ */}
                {tab === 'overview' && (
                    <div className="space-y-5">

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                            {kpiValues.map((val, i) => {
                                const cfg = KPI_CONFIGS[i];
                                return (
                                    <div
                                        key={i}
                                        className={`relative overflow-hidden rounded-2xl border p-5 ${cfg.border} ${cfg.bg}`}
                                        style={cfg.shadow}
                                    >
                                        <div className={`mb-3 ${cfg.colorClass} opacity-70`}>{cfg.icon}</div>
                                        <div className={`text-3xl font-black tabular-nums leading-none ${cfg.colorClass}`}>{val}</div>
                                        <div className={`mt-1.5 text-[10px] font-bold uppercase tracking-widest ${cfg.colorClass} opacity-55`}>{kpiLabels[i]}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Daily */}
                            <div className="rounded-2xl border border-ember/15 bg-depth/60 p-5" style={{ boxShadow: '0 2px 20px -4px hsl(var(--ember) / 0.12)' }}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-ember/80">{t('stats.chart_14_days')}</span>
                                    {!dailyChart.every((d) => d.sessions === 0) && (
                                        <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[10px] tabular-nums text-ember/70">
                                            {Math.max(...dailyChart.map(d => d.sessions))} max
                                        </span>
                                    )}
                                </div>
                                {dailyChart.every((d) => d.sessions === 0) ? (
                                    <p className="py-14 text-center text-[11px] text-whisper/45">{t('stats.no_data')}</p>
                                ) : (
                                    <div className="h-40">
                                        <BarChart
                                            data={dailyChart.map((d) => ({ label: d.label, sessions: d.sessions, highlighted: d.today }))}
                                            gradId="daily"
                                        />
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-[9px] text-whisper/40">
                                    <span>{dailyChart[0]?.label}</span>
                                    <span>{dailyChart[dailyChart.length - 1]?.label}</span>
                                </div>
                            </div>

                            {/* Weekly */}
                            <div className="rounded-2xl border border-bloom/15 bg-depth/60 p-5" style={{ boxShadow: '0 2px 20px -4px hsl(var(--bloom) / 0.12)' }}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-bloom/80">{t('stats.chart_8_weeks')}</span>
                                    {!weeklyChart.every((w) => w.sessions === 0) && (
                                        <span className="rounded-full bg-bloom/15 px-2 py-0.5 text-[10px] tabular-nums text-bloom/70">
                                            {Math.max(...weeklyChart.map(w => w.sessions))} max
                                        </span>
                                    )}
                                </div>
                                {weeklyChart.every((w) => w.sessions === 0) ? (
                                    <p className="py-14 text-center text-[11px] text-whisper/45">{t('stats.no_data')}</p>
                                ) : (
                                    <div className="h-40">
                                        <BarChart
                                            data={weeklyChart.map((w) => ({ label: w.label, sessions: w.sessions, highlighted: w.current }))}
                                            color="var(--color-bloom)"
                                            gradId="weekly"
                                        />
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between text-[9px] text-whisper/40">
                                    <span>{weeklyChart[0]?.label}</span>
                                    <span>{weeklyChart[weeklyChart.length - 1]?.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ HISTORY ════════════════════════════════════════════════ */}
                {tab === 'history' && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            {history.data.length === 0 ? (
                                <div className="rounded-2xl border border-white/8 bg-depth/40 py-14 text-center text-sm text-whisper/45">
                                    {t('stats.history_empty')}
                                </div>
                            ) : (
                                history.data.map((s) => <HistoryRow key={s.id} session={s} t={t} />)
                            )}
                        </div>
                        {history.last_page > 1 && (
                            <div className="flex items-center justify-between pt-1">
                                <button
                                    type="button"
                                    disabled={history.current_page <= 1}
                                    onClick={() => applyFilter({ history_page: history.current_page - 1 })}
                                    className="rounded-xl border border-white/8 bg-depth/50 px-4 py-2 text-[11px] text-whisper/60 transition-colors hover:text-moonbeam disabled:opacity-25"
                                >← {t('stats.history_prev')}</button>
                                <span className="text-[11px] text-whisper/50">
                                    {t('stats.history_page').replace(':cur', String(history.current_page)).replace(':last', String(history.last_page))}
                                </span>
                                <button
                                    type="button"
                                    disabled={history.current_page >= history.last_page}
                                    onClick={() => applyFilter({ history_page: history.current_page + 1 })}
                                    className="rounded-xl border border-white/8 bg-depth/50 px-4 py-2 text-[11px] text-whisper/60 transition-colors hover:text-moonbeam disabled:opacity-25"
                                >{t('stats.history_next')} →</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ LEADERBOARD ════════════════════════════════════════════ */}
                {tab === 'leaderboard' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex rounded-xl border border-white/8 bg-depth/50 p-1">
                                {(['weekly', 'monthly'] as LbPeriod[]).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setLbPeriod(p)}
                                        className={`rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                                            lbPeriod === p ? 'bg-surface text-moonbeam shadow-sm' : 'text-whisper/55 hover:text-moonbeam'
                                        }`}
                                    >
                                        {p === 'weekly' ? t('stats.lb_weekly') : t('stats.lb_monthly')}
                                    </button>
                                ))}
                            </div>
                            {myRank > 0 && (
                                <span className="rounded-full border border-ember/25 bg-ember/10 px-3.5 py-1.5 text-[11px] font-bold text-ember">
                                    #{myRank} {t('stats.lb_your_rank')}
                                </span>
                            )}
                        </div>

                        <div className="rounded-xl border border-bloom/15 bg-bloom/8 px-4 py-3 text-[12px] text-bloom/75">
                            {encourage}
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-depth/40 p-2">
                            {lbEntries.length === 0 ? (
                                <p className="py-10 text-center text-sm text-whisper/50">{t('stats.lb_empty')}</p>
                            ) : (
                                <div className="space-y-1">
                                    {lbEntries.slice(0, 10).map((entry, i) => (
                                        <LeaderRow key={entry.id} rank={i + 1} entry={entry} isCurrentUser={entry.id === userId} />
                                    ))}
                                    {myRank > 10 && myLbIndex >= 0 && (
                                        <>
                                            <div className="py-1 text-center text-[11px] text-whisper/35">· · ·</div>
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
                            <p className="text-center text-[11px] text-whisper/50">{t('stats.lb_not_ranked')}</p>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// ─── HistoryRow ───────────────────────────────────────────────────────────────

function HistoryRow({ session, t }: { session: HistorySession; t: (k: string) => string }) {
    const doneTasks    = session.tasks.filter((task) => task.done);
    const pendingTasks = session.tasks.filter((task) => !task.done);

    return (
        <div className={`rounded-2xl border p-4 transition-colors ${
            session.is_declared
                ? 'border-aurora/15 bg-aurora/5 hover:bg-aurora/8'
                : 'border-white/8 bg-depth/50 hover:bg-depth/80'
        }`}>
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="text-[12px] font-semibold text-moonbeam/90">{fmtDate(session.ended_at)}</div>
                        {session.is_declared && (
                            <span className="rounded-full border border-aurora/30 bg-aurora/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-aurora/70">
                                {t('stats.source_declared')}
                            </span>
                        )}
                    </div>
                    <div className="text-[10px] text-whisper/50">{fmtTime(session.ended_at)}</div>
                </div>
                <span className="rounded-full bg-ember/15 px-2.5 py-1 font-mono text-[12px] font-bold text-ember">
                    {fmtSeconds(session.duration_seconds)}
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-full border border-aurora/20 bg-aurora/8 px-2 py-0.5 text-[10px] font-medium text-aurora/80">
                    {session.project?.name ?? t('stats.history_no_project')}
                </span>
                {session.categories.map((c) => (
                    <span key={c.id} className="inline-flex items-center rounded-full border border-bloom/15 bg-bloom/8 px-2 py-0.5 text-[10px] text-bloom/70">
                        {c.name}
                    </span>
                ))}
            </div>

            {session.tasks.length > 0 && (
                <div className="mt-3 space-y-1 border-t border-white/5 pt-3">
                    {doneTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-2">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-bloom/60">
                                <polyline points="2 6 5 9 10 3" />
                            </svg>
                            <span className="text-[11px] leading-snug text-moonbeam/70">{task.title}</span>
                        </div>
                    ))}
                    {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-2">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 shrink-0 text-whisper/35">
                                <circle cx="6" cy="6" r="4" />
                            </svg>
                            <span className="text-[11px] leading-snug text-whisper/45">{task.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
