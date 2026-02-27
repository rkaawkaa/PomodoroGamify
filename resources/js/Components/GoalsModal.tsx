import { useTranslation } from '@/hooks/useTranslation';
import { Project, UserGoal } from '@/types';
import { useState } from 'react';

// --- CSRF helper ---
function getCsrf(): string {
    const raw = document.cookie
        .split('; ')
        .find((r) => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('=') ?? '';
    return decodeURIComponent(raw);
}

interface Props {
    goals: UserGoal[];
    projects: Project[];
    onClose: () => void;
    onSaved: (updated: UserGoal[]) => void;
}

// Pending local edits before saving
interface DailyDraft {
    id: number | null;
    target: string; // string for controlled input
    active: boolean;
}

interface MonthlyDraft {
    id: number | null;
    project_id: number | null; // null = global
    target: string;
}

export default function GoalsModal({ goals, projects, onClose, onSaved }: Props) {
    const { t } = useTranslation();

    const activeProjects = projects.filter((p) => p.is_active);

    // Initialise drafts from existing goals
    const existingDaily = goals.find((g) => g.period_type === 'daily') ?? null;
    const existingMonthly = goals.filter((g) => g.period_type === 'monthly');

    const [daily, setDaily] = useState<DailyDraft>({
        id: existingDaily?.id ?? null,
        target: existingDaily ? String(existingDaily.target) : '5',
        active: !!existingDaily,
    });

    const [monthlyList, setMonthlyList] = useState<MonthlyDraft[]>(
        existingMonthly.map((g) => ({
            id: g.id,
            project_id: g.project_id,
            target: String(g.target),
        }))
    );

    const [saving, setSaving] = useState(false);

    // Used project_ids (to avoid duplicates in the add dropdown)
    const usedProjectIds = monthlyList
        .map((m) => m.project_id)
        .filter((id): id is number => id !== null);

    const addMonthlyGoal = (projectId: number | null) => {
        setMonthlyList((prev) => [
            ...prev,
            { id: null, project_id: projectId, target: '20' },
        ]);
    };

    const updateMonthly = (idx: number, field: 'target', val: string) => {
        setMonthlyList((prev) =>
            prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m))
        );
    };

    const removeMonthly = (idx: number) => {
        setMonthlyList((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        setSaving(true);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrf(),
            Accept: 'application/json',
        };

        const upsert = async (body: object) => {
            const r = await fetch(route('goals.upsert'), {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            if (!r.ok) throw new Error();
            return (await r.json()) as { id: number };
        };

        const destroy = async (id: number) => {
            await fetch(route('goals.destroy', { id }), {
                method: 'DELETE',
                headers,
            });
        };

        try {
            const nextGoals: UserGoal[] = [];

            // --- daily ---
            if (daily.active) {
                const target = Math.max(1, parseInt(daily.target, 10) || 1);
                const { id } = await upsert({ period_type: 'daily', target });
                nextGoals.push({
                    id,
                    period_type: 'daily',
                    target,
                    project_id: null,
                });
            } else if (daily.id) {
                await destroy(daily.id);
            }

            // --- monthly ---
            // IDs that should remain
            const nextMonthlyIds = new Set<number>();

            for (const draft of monthlyList) {
                const target = Math.max(1, parseInt(draft.target, 10) || 1);
                const { id } = await upsert({
                    period_type: 'monthly',
                    target,
                    project_id: draft.project_id,
                });
                nextMonthlyIds.add(id);
                const proj = activeProjects.find((p) => p.id === draft.project_id);
                nextGoals.push({
                    id,
                    period_type: 'monthly',
                    target,
                    project_id: draft.project_id,
                    project: proj ? { id: proj.id, name: proj.name } : undefined,
                });
            }

            // Delete monthly goals that were removed
            for (const g of existingMonthly) {
                if (!nextMonthlyIds.has(g.id)) {
                    await destroy(g.id);
                }
            }

            onSaved(nextGoals);
            onClose();
        } catch {
            /* silent — keep modal open */
        } finally {
            setSaving(false);
        }
    };

    // Projects without a monthly goal already drafted (for the add dropdown)
    const availableProjects = activeProjects.filter(
        (p) => !usedProjectIds.includes(p.id)
    );
    const canAddGlobal = !monthlyList.some((m) => m.project_id === null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-whisper/10 bg-depth shadow-2xl shadow-black/70">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-boundary px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-moonbeam">
                        {t('goals.title')}
                    </h2>
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

                {/* Body (scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                    {/* ── Daily goal ── */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ember">
                                {t('goals.daily_goal')}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setDaily((d) => ({ ...d, active: !d.active }))}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                                    daily.active ? 'bg-ember' : 'bg-boundary'
                                }`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                    daily.active ? 'translate-x-[18px]' : 'translate-x-[3px]'
                                }`} />
                            </button>
                        </div>

                        {daily.active && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    max={99}
                                    value={daily.target}
                                    onChange={(e) => setDaily((d) => ({ ...d, target: e.target.value }))}
                                    className="w-20 rounded-xl border border-boundary bg-abyss px-3 py-2 text-center text-base font-medium text-moonbeam focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/25"
                                />
                                <span className="text-sm text-whisper">{t('goals.pomodoros_per_day')}</span>
                            </div>
                        )}
                    </section>

                    {/* ── Monthly goals ── */}
                    <section className="space-y-3 border-t border-boundary pt-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-bloom">
                            {t('goals.monthly_goal')}
                        </h3>

                        {monthlyList.length === 0 && (
                            <p className="text-xs text-whisper/40">{t('goals.no_daily_goal')}</p>
                        )}

                        {monthlyList.map((m, idx) => {
                            const proj = activeProjects.find((p) => p.id === m.project_id);
                            return (
                                <div key={idx} className="flex items-center gap-2 rounded-xl border border-boundary/60 bg-abyss/40 px-3 py-2.5">
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <span className="text-[11px] font-semibold text-whisper/70">
                                            {m.project_id === null ? t('goals.global') : (proj?.name ?? '?')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                max={9999}
                                                value={m.target}
                                                onChange={(e) => updateMonthly(idx, 'target', e.target.value)}
                                                className="w-16 rounded-lg border border-boundary bg-depth px-2 py-1 text-center text-sm font-medium text-moonbeam focus:border-bloom focus:outline-none focus:ring-1 focus:ring-bloom/25"
                                            />
                                            <span className="text-xs text-whisper/60">{t('goals.pomodoros_per_month')}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeMonthly(idx)}
                                        className="shrink-0 rounded-lg p-1.5 text-whisper/40 transition-colors hover:bg-surface hover:text-coral"
                                        title={t('goals.remove')}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M3 3l10 10M13 3L3 13" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}

                        {/* Add buttons */}
                        <div className="flex flex-wrap gap-2">
                            {canAddGlobal && (
                                <button
                                    type="button"
                                    onClick={() => addMonthlyGoal(null)}
                                    className="flex items-center gap-1 rounded-full border border-bloom/30 bg-bloom/10 px-3 py-1 text-[10px] font-semibold text-bloom/80 transition-all hover:border-bloom/50 hover:bg-bloom/20 hover:text-bloom"
                                >
                                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M5 1v8M1 5h8" />
                                    </svg>
                                    {t('goals.global')}
                                </button>
                            )}
                            {availableProjects.map((proj) => (
                                <button
                                    key={proj.id}
                                    type="button"
                                    onClick={() => addMonthlyGoal(proj.id)}
                                    className="flex items-center gap-1 rounded-full border border-bloom/30 bg-bloom/10 px-3 py-1 text-[10px] font-semibold text-bloom/80 transition-all hover:border-bloom/50 hover:bg-bloom/20 hover:text-bloom"
                                >
                                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M5 1v8M1 5h8" />
                                    </svg>
                                    {proj.name}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-boundary px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-boundary px-5 py-2.5 text-sm text-whisper transition-colors hover:border-whisper/50 hover:text-moonbeam"
                    >
                        {t('goals.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-ember px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
                    >
                        {saving ? '…' : t('goals.save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
