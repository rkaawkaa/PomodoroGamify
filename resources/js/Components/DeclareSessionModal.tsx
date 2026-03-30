import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import ItemSelect from '@/Components/ItemSelect';
import { useTranslation } from '@/hooks/useTranslation';
import { Category, PointAward, Project } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface DeclareResult {
    awards: PointAward[];
    total_earned: number;
    user_points: number;
    ended_at: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    projects: Project[];
    categories: Category[];
    onSaved: (result: DeclareResult) => void;
}

const PRESETS = [25, 50, 90, 120] as const;

function getCsrf(): string {
    const raw = document.cookie
        .split('; ')
        .find((r) => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('=') ?? '';
    return decodeURIComponent(raw);
}

function nowLocalDatetime(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DeclareSessionModal({ open, onClose, projects, categories, onSaved }: Props) {
    const { t } = useTranslation();

    const [workedAt, setWorkedAt]           = useState(nowLocalDatetime);
    const [durationMin, setDurationMin]     = useState(25);
    const [customInput, setCustomInput]     = useState('25');
    const [isCustom, setIsCustom]           = useState(false);
    const [projectId, setProjectId]         = useState<number | null>(null);
    const [categoryIds, setCategoryIds]     = useState<number[]>([]);
    const [submitting, setSubmitting]       = useState(false);
    const [error, setError]                 = useState<string | null>(null);
    const [success, setSuccess]             = useState<DeclareResult | null>(null);

    const backdropRef = useRef<HTMLDivElement>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setWorkedAt(nowLocalDatetime());
            setDurationMin(25);
            setCustomInput('25');
            setIsCustom(false);
            setProjectId(null);
            setCategoryIds([]);
            setError(null);
            setSuccess(null);
        }
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    const effectiveDuration = isCustom ? (parseInt(customInput, 10) || 1) : durationMin;

    const handlePreset = (min: number) => {
        setDurationMin(min);
        setCustomInput(String(min));
        setIsCustom(false);
    };

    const handleCustomChange = (val: string) => {
        setCustomInput(val);
        setIsCustom(true);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch(route('sessions.declare'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    worked_at:        workedAt,
                    duration_minutes: effectiveDuration,
                    project_id:       projectId,
                    category_ids:     categoryIds,
                }),
            });

            if (res.ok) {
                const json = await res.json() as DeclareResult;
                setSuccess(json);
                onSaved(json);
            } else {
                const json = await res.json().catch(() => ({}));
                const firstError = json?.errors
                    ? Object.values(json.errors as Record<string, string[]>).flat()[0]
                    : json?.message ?? t('common.error');
                setError(String(firstError));
            }
        } catch {
            setError(t('common.error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-t-3xl border border-boundary/60 bg-depth shadow-2xl sm:rounded-3xl">

                {/* Accent bar */}
                <div className="h-0.5 w-full bg-gradient-to-r from-aurora via-bloom/50 to-aurora" />

                <div className="px-6 pb-8 pt-5">

                    {/* Header */}
                    <div className="mb-5 flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-moonbeam">{t('declare.title')}</h2>
                            <p className="mt-0.5 text-[11px] text-whisper/55">{t('declare.hint')}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-boundary/50 text-whisper/50 transition-colors hover:border-whisper/40 hover:text-moonbeam"
                        >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
                            </svg>
                        </button>
                    </div>

                    {success ? (
                        /* ── Success state ── */
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-bloom/40 bg-bloom/15">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-bloom">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-moonbeam">{t('declare.success')}</p>
                                {success.total_earned > 0 && (
                                    <p className="mt-1 text-sm font-bold text-aurora">
                                        {t('declare.points_earned').replace(':n', String(success.total_earned))}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-2xl bg-bloom/80 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-bloom active:scale-95"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    ) : (
                        /* ── Form ── */
                        <div className="space-y-5">

                            {/* Date & time */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-whisper">
                                    {t('declare.date')}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={workedAt}
                                    max={nowLocalDatetime()}
                                    onChange={(e) => setWorkedAt(e.target.value)}
                                    className="w-full rounded-xl border border-boundary bg-surface px-3 py-2.5 text-sm text-moonbeam outline-none focus:border-aurora focus:ring-1 focus:ring-aurora/20"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-whisper">
                                    {t('declare.duration')}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PRESETS.map((min) => (
                                        <button
                                            key={min}
                                            type="button"
                                            onClick={() => handlePreset(min)}
                                            className={`rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-all ${
                                                !isCustom && durationMin === min
                                                    ? 'border-aurora/40 bg-aurora/15 text-aurora'
                                                    : 'border-boundary/60 text-whisper/70 hover:border-whisper/40 hover:text-moonbeam'
                                            }`}
                                        >
                                            {min} {t('declare.duration_min')}
                                        </button>
                                    ))}
                                    {/* Custom input */}
                                    <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 ${
                                        isCustom ? 'border-aurora/40 bg-aurora/15' : 'border-boundary/60'
                                    }`}>
                                        <input
                                            type="number"
                                            min={1}
                                            max={600}
                                            value={customInput}
                                            onChange={(e) => handleCustomChange(e.target.value)}
                                            onFocus={() => setIsCustom(true)}
                                            className={`w-12 bg-transparent text-center text-[12px] font-semibold outline-none ${
                                                isCustom ? 'text-aurora' : 'text-whisper/70'
                                            }`}
                                        />
                                        <span className={`text-[11px] ${isCustom ? 'text-aurora/70' : 'text-whisper/50'}`}>
                                            {t('declare.duration_min')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Project */}
                            <ItemSelect
                                label={t('project.label')}
                                items={projects}
                                value={projectId}
                                onChange={setProjectId}
                                storeRoute="projects.store"
                                noneKey="project.none"
                                createNewKey="project.create_new"
                                namePlaceholderKey="project.name_placeholder"
                            />

                            {/* Categories */}
                            <CategoryMultiSelect
                                label={t('category.label')}
                                items={categories}
                                values={categoryIds}
                                onChange={setCategoryIds}
                                storeRoute="categories.store"
                                noneKey="category.none"
                                createNewKey="category.create_new"
                                namePlaceholderKey="category.name_placeholder"
                                selectedCountKey="category.selected"
                            />

                            {/* Error */}
                            {error && (
                                <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-[11px] text-coral/80">
                                    {error}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || !workedAt || effectiveDuration < 1}
                                className="w-full rounded-2xl bg-aurora/80 py-3 text-sm font-bold text-white shadow-lg shadow-aurora/25 transition-all hover:bg-aurora active:scale-95 disabled:opacity-40"
                            >
                                {submitting ? t('common.loading') : t('declare.submit')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
