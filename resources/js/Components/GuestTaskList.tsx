import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps, Task } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';

// ─── Toast variants ────────────────────────────────────────────────────────
const TOAST_VARIANTS = [
    'animate-in fade-in slide-in-from-bottom-2 duration-300 bg-bloom/20 text-bloom',
    'animate-in zoom-in-90 fade-in duration-200 bg-ember/15 border border-ember/30 text-ember',
    'animate-in fade-in slide-in-from-right-4 duration-300 bg-aurora/15 text-aurora',
] as const;

type ToastVariant = 0 | 1 | 2;
interface ToastState { msg: string; variant: ToastVariant; key: number; }

// ─── Celebration messages ──────────────────────────────────────────────────
const TOASTS: Record<string, Array<() => string>> = {
    fr: [
        () => `Bravo !`,
        () => `Bien joué !`,
        () => `Excellent !`,
        () => `Une de moins !`,
        () => `Tâche accomplie !`,
        () => `C'est dans la boîte !`,
        () => `En avant !`,
        () => `Superbe !`,
    ],
    en: [
        () => `Well done!`,
        () => `Nice work!`,
        () => `Great job!`,
        () => `One down!`,
        () => `Task complete!`,
        () => `On a roll!`,
        () => `Nailed it!`,
        () => `Awesome!`,
    ],
};

function pickToast(locale: string): { msg: string; variant: ToastVariant } {
    const list = TOASTS[locale] ?? TOASTS['en'];
    const fn = list[Math.floor(Math.random() * list.length)];
    const variant = (Math.floor(Math.random() * 3)) as ToastVariant;
    return { msg: fn(), variant };
}

// ─── Props ─────────────────────────────────────────────────────────────────
interface Props {
    isFocus: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function GuestTaskList({ isFocus }: Props) {
    const { t } = useTranslation();
    const { locale } = usePage<PageProps>().props;

    // ── Tasks persisted in localStorage ──────────────────────────────────
    const [tasks, setTasks] = useLocalStorage<Task[]>('pomobloom_guest_tasks', []);

    // ── Hidden ids (clear / individual hide — frontend-only) ─────────────
    const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set());

    // ── Done tasks visible toggle (hidden by default) ─────────────────────
    const [showDone, setShowDone] = useState(false);

    // ── UI state ─────────────────────────────────────────────────────────
    const [activeId, setActiveId] = useState<number | null>(null);
    const [isAdding, setIsAdding]   = useState(false);
    const [addValue, setAddValue]   = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [flashId, setFlashId]     = useState<number | null>(null);

    // ── Drag & drop state ────────────────────────────────────────────────
    const [draggedId, setDraggedId]   = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);

    const handleReorder = (targetId: number) => {
        if (!draggedId || draggedId === targetId) return;
        setTasks((prev) => {
            const list = [...prev];
            const from = list.findIndex((t) => t.id === draggedId);
            const to   = list.findIndex((t) => t.id === targetId);
            if (from === -1 || to === -1) return prev;
            const [item] = list.splice(from, 1);
            list.splice(to, 0, item);
            return list;
        });
        setDraggedId(null);
        setDragOverId(null);
    };

    // ── Toast ─────────────────────────────────────────────────────────────
    const [toast, setToast]     = useState<ToastState | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback((msg: string, variant: ToastVariant) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ msg, variant, key: Date.now() });
        toastTimer.current = setTimeout(() => setToast(null), 2800);
    }, []);

    // ── Add ───────────────────────────────────────────────────────────────
    const handleAddSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        const title = addValue.trim();
        if (!title) { setIsAdding(false); setAddValue(''); return; }
        setIsAdding(false);
        setAddValue('');
        const newTask: Task = { id: Date.now(), title, status: 'pending', completed_at: null, session_id: null };
        setTasks((prev) => [newTask, ...prev]);
        setActiveId(newTask.id);
    }, [addValue, setTasks]);

    const handleAddBlur = useCallback(() => {
        if (addValue.trim()) handleAddSubmit();
        else { setIsAdding(false); setAddValue(''); }
    }, [addValue, handleAddSubmit]);

    // ── Complete ──────────────────────────────────────────────────────────
    const handleComplete = useCallback((id: number) => {
        setTasks((prev) =>
            prev.map((t) => t.id === id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t)
        );
        setFlashId(id);
        setTimeout(() => setFlashId(null), 500);
        const { msg, variant } = pickToast(locale);
        showToast(msg, variant);
        if (activeId === id) setActiveId(null);
    }, [activeId, locale, setTasks, showToast]);

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDelete = useCallback((id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        if (activeId === id) setActiveId(null);
    }, [activeId, setTasks]);

    // ── Hide ──────────────────────────────────────────────────────────────
    const handleHide = useCallback((id: number) => {
        setHiddenIds((prev) => new Set([...prev, id]));
    }, []);

    // ── Rename ────────────────────────────────────────────────────────────
    const startEdit = useCallback((task: Task) => {
        setEditingId(task.id);
        setEditValue(task.title);
    }, []);

    const commitRename = useCallback((id: number) => {
        const title = editValue.trim();
        setEditingId(null);
        if (!title) return;
        setTasks((list) => list.map((t) => t.id === id ? { ...t, title } : t));
    }, [editValue, setTasks]);

    // ── Derived ───────────────────────────────────────────────────────────
    const visibleTasks = tasks.filter((t) => !hiddenIds.has(t.id));
    const pending      = visibleTasks.filter((t) => t.status === 'pending');
    const allDone      = visibleTasks.filter((t) => t.status === 'done');
    const visibleDone  = showDone ? allDone : [];

    const doneLabel = locale === 'fr'
        ? `${allDone.length} terminée${allDone.length > 1 ? 's' : ''}`
        : `${allDone.length} done`;

    return (
        <div className="mb-4 rounded-2xl border border-boundary/60 bg-surface/30 px-3 py-3">

            {/* ── Celebration toast ──────────────────────────────────────── */}
            <div className={`overflow-hidden transition-all duration-300 ${toast ? 'mb-2.5 max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                {toast && (
                    <div key={toast.key} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${TOAST_VARIANTS[toast.variant]}`}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <polyline points="2 6 5 9 10 3" />
                        </svg>
                        <span className="text-[11px] font-semibold">{toast.msg}</span>
                    </div>
                )}
            </div>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="mb-2 flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isFocus ? 'text-ember' : 'text-bloom'}`}>
                    {t('tasks.label')}
                </span>
                <button
                    type="button"
                    onClick={() => { setIsAdding(true); setAddValue(''); }}
                    title={t('tasks.add_placeholder')}
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all ${
                        isFocus
                            ? 'border-ember/40 bg-ember/15 text-ember hover:border-ember/70 hover:bg-ember/25'
                            : 'border-bloom/40 bg-bloom/15 text-bloom hover:border-bloom/70 hover:bg-bloom/25'
                    }`}
                >
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="1" x2="5" y2="9" /><line x1="1" y1="5" x2="9" y2="5" />
                    </svg>
                    <span>{t('tasks.add')}</span>
                </button>
            </div>

            {/* ── Add input ──────────────────────────────────────────────── */}
            {isAdding && (
                <form onSubmit={handleAddSubmit} className="mb-2">
                    <input
                        autoFocus
                        value={addValue}
                        onChange={(e) => setAddValue(e.target.value)}
                        onBlur={handleAddBlur}
                        onKeyDown={(e) => e.key === 'Escape' && (setIsAdding(false), setAddValue(''))}
                        placeholder={t('tasks.add_placeholder')}
                        className="w-full rounded-lg bg-surface/80 px-2.5 py-1.5 text-[12px] text-moonbeam outline-none placeholder:text-whisper/50 focus:ring-1 focus:ring-ember/50"
                    />
                </form>
            )}

            {/* ── Task list ──────────────────────────────────────────────── */}
            <div className="max-h-36 space-y-0.5 overflow-y-auto">
                {pending.map((task) => (
                    <GuestTaskRow
                        key={task.id}
                        task={task}
                        isActive={activeId === task.id}
                        isFlashing={flashId === task.id}
                        isEditing={editingId === task.id}
                        editValue={editValue}
                        isFocus={isFocus}
                        isDragging={draggedId === task.id}
                        isDraggedOver={dragOverId === task.id && draggedId !== task.id}
                        onToggleActive={() => setActiveId((prev) => prev === task.id ? null : task.id)}
                        onComplete={() => handleComplete(task.id)}
                        onDelete={() => handleDelete(task.id)}
                        onHide={() => handleHide(task.id)}
                        onStartEdit={() => startEdit(task)}
                        onEditChange={setEditValue}
                        onCommitRename={() => commitRename(task.id)}
                        onCancelRename={() => setEditingId(null)}
                        onDragStart={() => setDraggedId(task.id)}
                        onDragOver={(e) => { e.preventDefault(); setDragOverId(task.id); }}
                        onDrop={() => handleReorder(task.id)}
                        onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    />
                ))}

                {visibleDone.map((task) => (
                    <GuestTaskRow
                        key={task.id}
                        task={task}
                        isActive={false}
                        isFlashing={false}
                        isEditing={false}
                        editValue=""
                        isFocus={isFocus}
                        isDragging={false}
                        isDraggedOver={false}
                        onToggleActive={() => {}}
                        onComplete={() => {}}
                        onDelete={() => handleDelete(task.id)}
                        onHide={() => handleHide(task.id)}
                        onStartEdit={() => {}}
                        onEditChange={() => {}}
                        onCommitRename={() => {}}
                        onCancelRename={() => {}}
                        onDragStart={() => {}}
                        onDragOver={() => {}}
                        onDrop={() => {}}
                        onDragEnd={() => {}}
                    />
                ))}

                {pending.length === 0 && !isAdding && allDone.length === 0 && (
                    <p className="py-1 text-center text-[11px] text-whisper/50">{t('tasks.empty')}</p>
                )}
            </div>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            {(allDone.length > 0 || pending.length > 0) && (
                <div className="mt-2 flex items-center justify-between gap-2">
                    {allDone.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => setShowDone((v) => !v)}
                            className="flex items-center gap-1 text-[10px] text-whisper/50 transition-colors hover:text-whisper/75"
                        >
                            <svg
                                width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className={`transition-transform duration-200 ${showDone ? 'rotate-180' : ''}`}
                            >
                                <polyline points="2 3 5 7 8 3" />
                            </svg>
                            <span>{doneLabel}</span>
                        </button>
                    ) : <span />}

                    {allDone.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setHiddenIds((prev) => new Set([...prev, ...allDone.map((t) => t.id)]))}
                            className="text-[10px] text-whisper/40 transition-colors hover:text-whisper/70"
                        >
                            {t('tasks.clear')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Task row (identical UI to TaskList's TaskRow) ─────────────────────────
interface RowProps {
    task: Task;
    isActive: boolean;
    isFlashing: boolean;
    isEditing: boolean;
    editValue: string;
    isFocus: boolean;
    isDragging: boolean;
    isDraggedOver: boolean;
    onToggleActive: () => void;
    onComplete: () => void;
    onDelete: () => void;
    onHide: () => void;
    onStartEdit: () => void;
    onEditChange: (v: string) => void;
    onCommitRename: () => void;
    onCancelRename: () => void;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
    onDragEnd: () => void;
}

function GuestTaskRow({
    task, isActive, isFlashing, isEditing, editValue, isFocus,
    isDragging, isDraggedOver,
    onToggleActive, onComplete, onDelete, onHide, onStartEdit, onEditChange, onCommitRename, onCancelRename,
    onDragStart, onDragOver, onDrop, onDragEnd,
}: RowProps) {
    const isDone = task.status === 'done';

    return (
        <div
            draggable={!isDone}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200
                border-t-2
                ${isDraggedOver ? 'border-ember/60' : 'border-transparent'}
                ${isDragging   ? 'opacity-40 scale-[0.97]' : ''}
                ${isFlashing ? 'bg-bloom/25' :
                  isActive   ? (isFocus ? 'bg-ember/15' : 'bg-bloom/15') :
                               'hover:bg-surface/70'}
                ${!isDone ? 'cursor-grab active:cursor-grabbing' : ''}
            `}
        >
            <button
                type="button"
                onClick={onToggleActive}
                disabled={isDone}
                className={`h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] transition-all duration-200 ${
                    isActive
                        ? (isFocus ? 'border-ember bg-ember scale-110' : 'border-bloom bg-bloom scale-110')
                        : isDone
                            ? 'border-whisper/30 bg-whisper/15 cursor-default'
                            : 'border-whisper/50 hover:border-whisper/80'
                }`}
            />

            {isEditing ? (
                <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onCommitRename();
                        if (e.key === 'Escape') onCancelRename();
                    }}
                    className="flex-1 rounded bg-surface/80 px-1 py-0.5 text-[12px] text-moonbeam outline-none focus:ring-1 focus:ring-ember/50"
                />
            ) : (
                <span
                    onDoubleClick={!isDone ? onStartEdit : undefined}
                    title={!isDone ? 'Double-clic pour renommer' : undefined}
                    className={`flex-1 select-none truncate text-[12px] transition-all duration-300 ${
                        isDone
                            ? 'text-whisper/45 line-through'
                            : isActive
                                ? 'font-semibold text-moonbeam'
                                : 'text-moonbeam/90'
                    }`}
                >
                    {task.title}
                </span>
            )}

            <div className={`flex shrink-0 items-center gap-1 transition-opacity duration-150 ${
                isDone ? 'opacity-0 group-hover:opacity-80' : 'opacity-0 group-hover:opacity-100'
            }`}>
                {!isDone && (
                    <button
                        type="button"
                        onClick={onComplete}
                        title="Terminer"
                        className="flex h-5 w-5 items-center justify-center rounded text-bloom/70 hover:bg-bloom/20 hover:text-bloom"
                    >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 6 5 9 10 3" />
                        </svg>
                    </button>
                )}
                {isDone && (
                    <button
                        type="button"
                        onClick={onHide}
                        title="Masquer"
                        className="flex h-5 w-5 items-center justify-center rounded text-whisper/50 hover:bg-surface/80 hover:text-whisper/80"
                    >
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 1l12 12" />
                            <path d="M6.3 3.1A5.4 5.4 0 0 1 7 3c3 0 5.4 2.7 6 4-.3.8-1 1.9-2 2.8" />
                            <path d="M3.5 4.5C2.2 5.5 1.3 6.6 1 7c.6 1.3 3 4 6 4a5.5 5.5 0 0 0 2.5-.6" />
                            <path d="M5 7a2 2 0 0 0 3.4 1.4" />
                        </svg>
                    </button>
                )}
                <button
                    type="button"
                    onClick={onDelete}
                    title="Supprimer"
                    className="flex h-5 w-5 items-center justify-center rounded text-whisper/45 hover:bg-coral/15 hover:text-coral"
                >
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
