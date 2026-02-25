import { useTranslation } from '@/hooks/useTranslation';
import { Category, Project } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Tab = 'projects' | 'categories';

interface ItemRowProps {
    item: Project | Category;
    updateRoute: string;
}

function ItemRow({ item, updateRoute }: ItemRowProps) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    useEffect(() => {
        if (!editing) setName(item.name);
    }, [item.name, editing]);

    const save = () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === item.name) { setEditing(false); return; }
        router.patch(route(updateRoute, item.id), { name: trimmed }, {
            preserveState: true,
            only: ['projects', 'categories'],
            onFinish: () => setEditing(false),
        });
    };

    const toggleArchive = () => {
        router.patch(route(updateRoute, item.id), { is_active: !item.is_active }, {
            preserveState: true,
            only: ['projects', 'categories'],
        });
    };

    return (
        <div className={`mx-4 my-1.5 rounded-xl border px-4 py-3 transition-colors ${
            item.is_active
                ? 'border-boundary/70 bg-surface/50'
                : 'border-boundary/30 bg-surface/20'
        }`}>
            <div className="flex items-center gap-3">
                {/* Status dot */}
                <span className={`h-2 w-2 shrink-0 rounded-full ${item.is_active ? 'bg-bloom' : 'bg-boundary'}`} />

                {/* Name / inline edit */}
                {editing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength={40}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') save();
                            if (e.key === 'Escape') { setEditing(false); setName(item.name); }
                        }}
                        className="flex-1 rounded-xl border border-ember bg-abyss px-3 py-2 text-sm text-moonbeam outline-none focus:ring-1 focus:ring-ember/25"
                    />
                ) : (
                    <span className={`flex-1 truncate text-sm ${item.is_active ? 'text-moonbeam' : 'text-whisper'}`}>
                        {item.name}
                    </span>
                )}

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                    {editing ? (
                        <>
                            <button
                                type="button"
                                onClick={save}
                                className="rounded-lg bg-ember px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:brightness-110"
                            >
                                {t('common.save')}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEditing(false); setName(item.name); }}
                                className="rounded-lg border border-boundary px-3 py-1.5 text-xs text-whisper transition-colors hover:text-moonbeam"
                            >
                                {t('common.cancel')}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Rename */}
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                title={t('manage.rename')}
                                className="rounded-lg p-2 text-whisper/60 transition-colors hover:bg-boundary/30 hover:text-moonbeam"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>

                            {/* Archive / Unarchive */}
                            {item.is_active ? (
                                <button
                                    type="button"
                                    onClick={toggleArchive}
                                    title={t('manage.archive')}
                                    className="rounded-lg border border-coral/40 bg-coral/10 p-2 text-coral transition-colors hover:bg-coral/20"
                                >
                                    {/* Archive: box with arrow going in */}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 8v13H3V8"/>
                                        <path d="M1 3h22v5H1z"/>
                                        <line x1="10" y1="12" x2="14" y2="12"/>
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={toggleArchive}
                                    title={t('manage.unarchive')}
                                    className="rounded-lg border border-bloom/40 bg-bloom/10 p-2 text-bloom transition-colors hover:bg-bloom/20"
                                >
                                    {/* Unarchive: box with arrow going up */}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 8v13H3V8"/>
                                        <path d="M1 3h22v5H1z"/>
                                        <polyline points="9 13 12 10 15 13"/>
                                        <line x1="12" y1="10" x2="12" y2="17"/>
                                    </svg>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

interface AddRowProps {
    storeRoute: string;
    placeholderKey: string;
    addLabelKey: string;
}

function AddRow({ storeRoute, placeholderKey, addLabelKey }: AddRowProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [posting, setPosting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const submit = () => {
        const trimmed = name.trim();
        if (!trimmed || posting) return;
        setPosting(true);
        router.post(route(storeRoute), { name: trimmed }, {
            preserveState: true,
            only: ['projects', 'categories'],
            onSuccess: () => { setName(''); setOpen(false); setPosting(false); },
            onError: () => setPosting(false),
        });
    };

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mx-4 my-2 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl border border-dashed border-ember/40 bg-ember/5 py-3 text-sm font-medium text-ember/70 transition-colors hover:border-ember/70 hover:bg-ember/10 hover:text-ember"
            >
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 1v10M1 6h10" />
                </svg>
                {t(addLabelKey)}
            </button>
        );
    }

    return (
        <div className="mx-4 my-2 rounded-xl border border-boundary/70 bg-surface/40 px-4 py-3">
            <input
                ref={inputRef}
                type="text"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                    if (e.key === 'Escape') { setOpen(false); setName(''); }
                }}
                placeholder={t(placeholderKey)}
                className="mb-3 w-full rounded-xl border border-boundary bg-abyss px-4 py-2.5 text-sm text-moonbeam outline-none placeholder:text-boundary focus:border-ember focus:ring-1 focus:ring-ember/20"
                disabled={posting}
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={submit}
                    disabled={posting || !name.trim()}
                    className="flex-1 rounded-xl bg-ember py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                    {t('common.save')}
                </button>
                <button
                    type="button"
                    onClick={() => { setOpen(false); setName(''); }}
                    className="flex-1 rounded-xl border border-boundary py-2.5 text-sm text-whisper transition-colors hover:border-whisper/50 hover:text-moonbeam"
                >
                    {t('common.cancel')}
                </button>
            </div>
        </div>
    );
}

interface Props {
    projects: Project[];
    categories: Category[];
    onClose: () => void;
}

export default function ManageItemsModal({ projects, categories, onClose }: Props) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('projects');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-whisper/10 bg-depth shadow-2xl shadow-black/70">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-boundary px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-moonbeam">
                        {t('manage.title')}
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

                {/* Tabs */}
                <div className="flex border-b border-boundary">
                    {(['projects', 'categories'] as Tab[]).map((t_) => (
                        <button
                            key={t_}
                            type="button"
                            onClick={() => setTab(t_)}
                            className={`flex-1 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                                tab === t_
                                    ? 'border-b-2 border-ember text-ember'
                                    : 'text-whisper/60 hover:text-whisper'
                            }`}
                        >
                            {t_ === 'projects' ? t('manage.tab_projects') : t('manage.tab_categories')}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto py-2">
                    {tab === 'projects' ? (
                        <>
                            {projects.length === 0 ? (
                                <p className="px-6 py-6 text-center text-sm text-whisper/50">{t('manage.empty_projects')}</p>
                            ) : (
                                projects.map((p) => (
                                    <ItemRow key={p.id} item={p} updateRoute="projects.update" />
                                ))
                            )}
                            <AddRow storeRoute="projects.store" placeholderKey="project.name_placeholder" addLabelKey="manage.add_project" />
                        </>
                    ) : (
                        <>
                            {categories.length === 0 ? (
                                <p className="px-6 py-6 text-center text-sm text-whisper/50">{t('manage.empty_categories')}</p>
                            ) : (
                                categories.map((c) => (
                                    <ItemRow key={c.id} item={c} updateRoute="categories.update" />
                                ))
                            )}
                            <AddRow storeRoute="categories.store" placeholderKey="category.name_placeholder" addLabelKey="manage.add_category" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
