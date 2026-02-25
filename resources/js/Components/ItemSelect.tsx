import { useTranslation } from '@/hooks/useTranslation';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export interface SelectableItem {
    id: number;
    name: string;
    is_active: boolean;
}

interface Props {
    label: string;
    items: SelectableItem[];
    value: number | null;
    onChange: (id: number | null) => void;
    storeRoute: string;
    noneKey: string;
    createNewKey: string;
    namePlaceholderKey: string;
    disabled?: boolean;
}

export default function ItemSelect({
    label,
    items,
    value,
    onChange,
    storeRoute,
    noneKey,
    createNewKey,
    namePlaceholderKey,
    disabled = false,
}: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [pendingName, setPendingName] = useState<string | null>(null);
    const [posting, setPosting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeItems = items.filter((i) => i.is_active);
    const selected = activeItems.find((i) => i.id === value) ?? null;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setCreating(false);
                setNewName('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (pendingName) {
            const match = items.filter((i) => i.is_active).find((i) => i.name === pendingName);
            if (match) {
                onChange(match.id);
                setPendingName(null);
            }
        }
    }, [items, pendingName]);

    useEffect(() => {
        if (creating) inputRef.current?.focus();
    }, [creating]);

    const handleCreate = () => {
        const name = newName.trim();
        if (!name || posting) return;
        setPosting(true);
        router.post(route(storeRoute), { name }, {
            preserveState: true,
            onSuccess: () => {
                setPendingName(name);
                setCreating(false);
                setNewName('');
                setOpen(false);
                setPosting(false);
            },
            onError: () => setPosting(false),
        });
    };

    return (
        <div ref={ref} className="relative min-w-0">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-whisper">
                {label}
            </p>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-surface px-3 py-2.5 text-left text-sm transition-colors ${
                    disabled
                        ? 'cursor-default border-boundary/40 opacity-40'
                        : open
                            ? 'border-whisper/40'
                            : 'border-boundary hover:border-whisper/40'
                }`}
            >
                <span className={`truncate ${selected ? 'text-moonbeam' : 'text-whisper/50'}`}>
                    {selected ? selected.name : t(noneKey)}
                </span>
                <svg
                    className={`h-3 w-3 shrink-0 text-whisper/50 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 3.5l3 3 3-3" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[180px] overflow-hidden rounded-xl border border-boundary bg-abyss shadow-2xl shadow-black/60">
                    {/* None */}
                    <button
                        type="button"
                        onClick={() => { onChange(null); setOpen(false); }}
                        className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors hover:bg-surface/60 ${
                            value === null ? 'text-ember' : 'text-whisper/60'
                        }`}
                    >
                        {t(noneKey)}
                    </button>

                    {activeItems.length > 0 && (
                        <div className="mx-3 border-t border-boundary/60" />
                    )}

                    {activeItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => { onChange(item.id); setOpen(false); }}
                            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-surface/60 ${
                                item.id === value ? 'text-ember' : 'text-moonbeam'
                            }`}
                        >
                            <span className="truncate">{item.name}</span>
                            {item.id === value && (
                                <svg className="ml-2 h-3.5 w-3.5 shrink-0 text-ember" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 6l3 3 5-5" />
                                </svg>
                            )}
                        </button>
                    ))}

                    <div className="mx-3 border-t border-boundary/60" />

                    {!creating ? (
                        <button
                            type="button"
                            onClick={() => setCreating(true)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-ember/80 transition-colors hover:bg-surface/60 hover:text-ember"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 1v10M1 6h10" />
                            </svg>
                            {t(createNewKey)}
                        </button>
                    ) : (
                        <div className="px-3 py-3">
                            <input
                                ref={inputRef}
                                type="text"
                                maxLength={40}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreate();
                                    if (e.key === 'Escape') { setCreating(false); setNewName(''); }
                                }}
                                placeholder={t(namePlaceholderKey)}
                                className="mb-2.5 w-full rounded-xl border border-boundary bg-depth px-3 py-2.5 text-sm text-moonbeam outline-none placeholder:text-boundary/80 focus:border-ember focus:ring-1 focus:ring-ember/20"
                                disabled={posting}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={posting || !newName.trim()}
                                    className="flex-1 rounded-xl bg-ember py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                                >
                                    {t('common.save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCreating(false); setNewName(''); }}
                                    className="flex-1 rounded-xl border border-boundary py-2.5 text-sm text-whisper transition-colors hover:border-whisper/40 hover:text-moonbeam"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
