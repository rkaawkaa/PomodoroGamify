import { useTranslation } from '@/hooks/useTranslation';
import { PomodoroSettings } from '@/types';
import { useState } from 'react';

interface Props {
    settings: PomodoroSettings;
    onClose: () => void;
    onSaved: (updated: PomodoroSettings) => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                checked ? 'bg-ember' : 'bg-boundary'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    checked ? 'translate-x-[22px]' : 'translate-x-[4px]'
                }`}
            />
        </button>
    );
}

export default function GuestSettingsModal({ settings, onClose, onSaved }: Props) {
    const { t } = useTranslation();
    const [data, setData] = useState<PomodoroSettings>({ ...settings });
    const [saved, setSaved] = useState(false);

    const set = <K extends keyof PomodoroSettings>(k: K, v: PomodoroSettings[K]) =>
        setData((prev) => ({ ...prev, [k]: v }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaved(data);
        setSaved(true);
        setTimeout(onClose, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-whisper/10 bg-depth shadow-2xl shadow-black/70">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-boundary px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-moonbeam">
                        {t('settings.title')}
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

                {/* Form */}
                <form onSubmit={submit} className="space-y-5 px-6 py-6">
                    {/* Pomodoro duration */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-whisper">
                            {t('settings.pomodoro_duration')}
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={2}
                                max={300}
                                value={data.pomodoro_duration}
                                onChange={(e) => set('pomodoro_duration', Number(e.target.value))}
                                className="w-24 rounded-xl border border-boundary bg-abyss px-3 py-2.5 text-center text-base font-medium text-moonbeam focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/25"
                            />
                            <span className="text-sm text-whisper">{t('settings.min')}</span>
                        </div>
                    </div>

                    {/* Break duration */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-whisper">
                            {t('settings.break_duration')}
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={1}
                                max={120}
                                value={data.break_duration}
                                onChange={(e) => set('break_duration', Number(e.target.value))}
                                className="w-24 rounded-xl border border-boundary bg-abyss px-3 py-2.5 text-center text-base font-medium text-moonbeam focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/25"
                            />
                            <span className="text-sm text-whisper">{t('settings.min')}</span>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4 border-t border-boundary pt-4">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-whisper">{t('settings.auto_start_breaks')}</span>
                            <Toggle checked={data.auto_start_breaks} onChange={(v) => set('auto_start_breaks', v)} />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-whisper">{t('settings.auto_start_pomodoros')}</span>
                            <Toggle checked={data.auto_start_pomodoros} onChange={(v) => set('auto_start_pomodoros', v)} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-boundary pt-5">
                        {saved && (
                            <span className="mr-auto text-xs font-medium text-bloom">
                                ✓ {t('settings.saved')}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-boundary px-5 py-2.5 text-sm text-whisper transition-colors hover:border-whisper/50 hover:text-moonbeam"
                        >
                            {t('settings.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-ember px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                        >
                            {t('settings.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
