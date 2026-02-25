import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import ItemSelect from '@/Components/ItemSelect';
import ManageItemsModal from '@/Components/ManageItemsModal';
import PomodoroSettingsModal from '@/Components/PomodoroSettingsModal';
import { useTranslation } from '@/hooks/useTranslation';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, PageProps, PomodoroSettings, Project } from '@/types';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = PageProps<{
    pomodoroSettings: PomodoroSettings;
    projects: Project[];
    categories: Category[];
}>;

type TimerMode = 'focus' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

function pad(n: number) {
    return String(n).padStart(2, '0');
}

function formatTitle(seconds: number, appName: string) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${pad(m)}:${pad(s)} — ${appName}`;
}

const CIRCUMFERENCE = 2 * Math.PI * 54;

// --- Audio helpers (Web Audio API, no asset files needed) ---
function playSound(type: 'focus' | 'break') {
    try {
        const ctx = new AudioContext();
        const beep = (freq: number, startAt: number, dur: number, vol = 0.18) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(vol, ctx.currentTime + startAt);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur);
            osc.start(ctx.currentTime + startAt);
            osc.stop(ctx.currentTime + startAt + dur + 0.05);
        };
        if (type === 'focus') {
            beep(523, 0,    0.22); // C5
            beep(659, 0.24, 0.22); // E5
            beep(784, 0.48, 0.45); // G5
        } else {
            beep(659, 0,    0.30); // E5
            beep(523, 0.35, 0.45); // C5
        }
    } catch { /* AudioContext blocked — silent fail */ }
}

// Soft gentle chime for 1-minute warnings — low volume, slow attack
function playWarningSound() {
    try {
        const ctx = new AudioContext();
        const chime = (freq: number, startAt: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
            gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + startAt + 0.14);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + 1.5);
            osc.start(ctx.currentTime + startAt);
            osc.stop(ctx.currentTime + startAt + 1.6);
        };
        chime(440, 0);    // A4 — soft opening tone
        chime(523, 0.6);  // C5 — gentle rising close
    } catch { /* silent */ }
}

// --- CSRF token for fetch ---
function getCsrf(): string {
    const raw = document.cookie
        .split('; ')
        .find((r) => r.startsWith('XSRF-TOKEN='))
        ?.split('=').slice(1).join('=') ?? '';
    return decodeURIComponent(raw);
}

export default function Dashboard({ pomodoroSettings, projects, categories }: Props) {
    const { t } = useTranslation();

    // Modals
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);

    // Settings
    const [settings, setSettings] = useState<PomodoroSettings>(pomodoroSettings);

    // Timer state machine
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [remaining, setRemaining] = useState(pomodoroSettings.pomodoro_duration * 60);
    const [phaseTotal, setPhaseTotal] = useState(pomodoroSettings.pomodoro_duration * 60);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Stable refs to avoid stale closures inside setInterval / setTimeout
    const settingsRef = useRef(settings);
    const modeRef = useRef(mode);
    const remainingRef = useRef(remaining);
    const phaseTotalRef = useRef(phaseTotal);
    useEffect(() => { settingsRef.current = settings; }, [settings]);
    useEffect(() => { modeRef.current = mode; }, [mode]);
    useEffect(() => { remainingRef.current = remaining; }, [remaining]);
    useEffect(() => { phaseTotalRef.current = phaseTotal; }, [phaseTotal]);

    // Translation ref (stays current even after locale switch)
    const tRef = useRef(t);
    useEffect(() => { tRef.current = t; }, [t]);

    // Pending auto-start after a phase transition (avoids stale timerState = 'running' → 'running' no-op)
    const autoStartNextRef = useRef(false);

    // --- Service Worker + notifications ---
    const swRegRef = useRef<ServiceWorkerRegistration | null>(null);

    const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    );

    // Register SW and proactively request permission on mount
    useEffect(() => {
        // 1. Register Service Worker (enables background/OS-level notifications)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => { swRegRef.current = reg; })
                .catch(() => { /* fallback: new Notification() */ });
        }

        // 2. Ask for permission right away — browser shows its native prompt automatically
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((result) => setNotifPermission(result));
        }
    }, []);

    // Manual re-request (for the in-card banner button)
    const requestNotifPermission = useCallback(async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setNotifPermission(result);
    }, []);

    // Show a notification via SW (works in background) or fallback
    const notify = useCallback((title: string, body: string) => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        try {
            if (swRegRef.current) {
                swRegRef.current.showNotification(title, { body, icon: '/favicon.ico' });
            } else {
                new Notification(title, { body, icon: '/favicon.ico' });
            }
        } catch { /* silent */ }
    }, []);

    const notifyRef = useRef(notify);
    useEffect(() => { notifyRef.current = notify; }, [notify]);

    // --- Project / category selection ---
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const selectedProjectIdRef = useRef(selectedProjectId);
    const selectedCategoryIdsRef = useRef(selectedCategoryIds);
    useEffect(() => { selectedProjectIdRef.current = selectedProjectId; }, [selectedProjectId]);
    useEffect(() => { selectedCategoryIdsRef.current = selectedCategoryIds; }, [selectedCategoryIds]);

    // Clear selection if item is archived
    useEffect(() => {
        if (selectedProjectId && !projects.find((p) => p.id === selectedProjectId && p.is_active)) {
            setSelectedProjectId(null);
        }
    }, [projects]);

    useEffect(() => {
        setSelectedCategoryIds((prev) =>
            prev.filter((id) => categories.find((c) => c.id === id && c.is_active))
        );
    }, [categories]);

    // --- Save pomodoro session to DB ---
    const saveSession = useCallback(async (durationSeconds: number) => {
        try {
            await fetch(route('pomodoro-sessions.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    project_id: selectedProjectIdRef.current,
                    category_ids: selectedCategoryIdsRef.current,
                    duration_seconds: durationSeconds,
                }),
            });
        } catch { /* silent — never disrupt UX for a save failure */ }
    }, []);

    // --- Phase transitions ---
    // Always go through 'idle' first so the countdown useEffect always re-fires,
    // even when transitioning from running → running (auto_start case).
    const goToBreak = useCallback(() => {
        const s = settingsRef.current;
        const total = s.break_duration * 60;
        autoStartNextRef.current = s.auto_start_breaks;
        setMode('break');
        setRemaining(total);
        setPhaseTotal(total);
        setTimerState('idle');
    }, []);

    const goToFocus = useCallback(() => {
        const s = settingsRef.current;
        const total = s.pomodoro_duration * 60;
        autoStartNextRef.current = s.auto_start_pomodoros;
        setMode('focus');
        setRemaining(total);
        setPhaseTotal(total);
        setTimerState('idle');
    }, []);

    const goToBreakRef = useRef(goToBreak);
    const goToFocusRef = useRef(goToFocus);
    useEffect(() => { goToBreakRef.current = goToBreak; }, [goToBreak]);
    useEffect(() => { goToFocusRef.current = goToFocus; }, [goToFocus]);

    // --- End focus phase ---
    const endFocus = useCallback((natural: boolean) => {
        const elapsed = phaseTotalRef.current - remainingRef.current;
        if (natural || elapsed > 300) saveSession(elapsed);
        playSound('focus');
        notifyRef.current(
            tRef.current('notification.focus_title'),
            tRef.current('notification.focus_body'),
        );
        goToBreakRef.current();
    }, [saveSession]);

    // --- End break phase ---
    const endBreak = useCallback(() => {
        playSound('break');
        notifyRef.current(
            tRef.current('notification.break_title'),
            tRef.current('notification.break_body'),
        );
        goToFocusRef.current();
    }, []);

    const endFocusRef = useRef(endFocus);
    const endBreakRef = useRef(endBreak);
    useEffect(() => { endFocusRef.current = endFocus; }, [endFocus]);
    useEffect(() => { endBreakRef.current = endBreak; }, [endBreak]);

    // --- Auto-start next phase if flagged (handles running→idle→running transition) ---
    useEffect(() => {
        if (timerState === 'idle' && autoStartNextRef.current) {
            autoStartNextRef.current = false;
            setTimerState('running');
        }
    }, [timerState]);

    // --- 1-minute warning: fires once per phase when remaining hits 60s ---
    const warned1MinRef = useRef(false);
    useEffect(() => { warned1MinRef.current = false; }, [mode]); // reset on phase change

    useEffect(() => {
        if (timerState !== 'running') return;
        if (remaining !== 60) return;
        if (warned1MinRef.current) return;
        if (phaseTotalRef.current <= 90) return; // skip for phases ≤ 90s (avoids false warnings during testing)
        warned1MinRef.current = true;
        playWarningSound();
        if (modeRef.current === 'focus') {
            notifyRef.current(
                tRef.current('notification.focus_1min_title'),
                tRef.current('notification.focus_1min_body'),
            );
        } else {
            notifyRef.current(
                tRef.current('notification.break_1min_title'),
                tRef.current('notification.break_1min_body'),
            );
        }
    }, [remaining, timerState]);

    // --- Countdown tick ---
    useEffect(() => {
        if (timerState === 'running') {
            intervalRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setTimeout(() => {
                            if (modeRef.current === 'focus') {
                                endFocusRef.current(true);
                            } else {
                                endBreakRef.current();
                            }
                        }, 400);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [timerState]);

    // Reset timer when settings change (idle only)
    useEffect(() => {
        if (timerState === 'idle') {
            if (mode === 'focus') {
                const total = settings.pomodoro_duration * 60;
                setRemaining(total); setPhaseTotal(total);
            } else {
                const total = settings.break_duration * 60;
                setRemaining(total); setPhaseTotal(total);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.pomodoro_duration, settings.break_duration]);

    // Tab title
    useEffect(() => {
        document.title = timerState !== 'idle'
            ? formatTitle(remaining, t('app.name'))
            : `Pomodoro — ${t('app.name')}`;
    }, [remaining, timerState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // --- User actions ---
    const handleStart = useCallback(() => setTimerState('running'), []);
    const handlePause = useCallback(() => setTimerState('paused'), []);
    const handleResume = useCallback(() => setTimerState('running'), []);
    const handleSkipBreak = useCallback(() => {
        const total = settingsRef.current.pomodoro_duration * 60;
        setMode('focus');
        setRemaining(total);
        setPhaseTotal(total);
        setTimerState('idle'); // skip break → always idle, never auto-start
    }, []);
    const handleStop = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        if (modeRef.current === 'focus') {
            endFocusRef.current(false);
        } else {
            endBreakRef.current();
        }
    }, []);

    // --- Derived ---
    const isFocus = mode === 'focus';
    const isActive = timerState !== 'idle';
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const progress = phaseTotal > 0 ? remaining / phaseTotal : 1;
    const dashOffset = CIRCUMFERENCE * (1 - progress);

    return (
        <AuthenticatedLayout onManage={() => setManageOpen(true)}>
            <Head title="Pomodoro" />

            <div className="flex flex-1 flex-col items-center bg-gradient-to-b from-ember/[0.10] via-transparent to-bloom/[0.07] px-4 pt-8 pb-20">

                {/* Timer card — no overflow-hidden so dropdowns can escape */}
                <div className="w-full max-w-xs rounded-3xl border border-whisper/10 bg-depth shadow-2xl shadow-black/70">

                    {/* Top gradient accent: cross-fades focus (ember) ↔ break (bloom) */}
                    <div className="relative h-0.5 overflow-hidden rounded-t-3xl">
                        <div className={`absolute inset-0 bg-gradient-to-r from-ember via-bloom/50 to-ember transition-opacity duration-700 ${isFocus ? 'opacity-100' : 'opacity-0'}`} />
                        <div className={`absolute inset-0 bg-gradient-to-r from-bloom/80 via-bloom/30 to-bloom/80 transition-opacity duration-700 ${isFocus ? 'opacity-0' : 'opacity-100'}`} />
                    </div>

                    <div className="px-8 pb-8 pt-6">

                        {/* Header row: mode label | settings */}
                        <div className="mb-5 flex items-center justify-between">
                            <p className={`text-xs font-semibold uppercase tracking-[0.25em] transition-colors duration-700 ${isFocus ? 'text-ember' : 'text-bloom'}`}>
                                {isFocus ? t('timer.focus') : t('timer.short_break')}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSettingsOpen(true)}
                                title={t('settings.title')}
                                className="flex items-center gap-1.5 rounded-full border border-boundary/60 bg-surface/60 px-2.5 py-1 text-whisper transition-colors hover:border-whisper/40 hover:bg-surface hover:text-moonbeam"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                    {t('settings.title')}
                                </span>
                            </button>
                        </div>

                        {/* Ring + time */}
                        <div className="relative mx-auto mb-2 flex h-48 w-48 items-center justify-center">
                            <svg
                                className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                                viewBox="0 0 120 120"
                            >
                                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="4" className="text-boundary/25" />
                                <circle
                                    cx="60" cy="60" r="54"
                                    fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={dashOffset}
                                    className={`transition-[stroke-dashoffset,color] duration-700 ease-linear ${isFocus ? 'text-ember' : 'text-bloom'}`}
                                />
                            </svg>
                            <div className="relative z-10">
                                <span className="font-mono text-5xl font-light tabular-nums text-moonbeam">
                                    {pad(minutes)}:{pad(seconds)}
                                </span>
                            </div>
                        </div>

                        {/* Finish/skip button — visible only when active */}
                        <div className="mb-5 flex h-7 items-center justify-center">
                            {isActive && (
                                <button
                                    type="button"
                                    onClick={handleStop}
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-whisper/40 transition-colors hover:bg-boundary/20 hover:text-whisper/70"
                                >
                                    <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                                        <rect width="10" height="10" rx="2" />
                                    </svg>
                                    <span className="text-[10px] font-medium uppercase tracking-wider">
                                        {isFocus ? t('timer.stop') : t('timer.skip')}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Notification banner — shown until permission is granted */}
                        {notifPermission !== 'granted' && (
                            <div className={`mb-4 flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
                                notifPermission === 'denied'
                                    ? 'border-boundary/40 bg-surface/20'
                                    : 'border-ember/30 bg-ember/5'
                            }`}>
                                <svg className={`mt-0.5 shrink-0 ${notifPermission === 'denied' ? 'text-whisper/30' : 'text-ember/70'}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {notifPermission === 'denied' ? (
                                        <>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/>
                                        </>
                                    ) : (
                                        <>
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                        </>
                                    )}
                                </svg>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-[11px] leading-snug ${notifPermission === 'denied' ? 'text-whisper/40' : 'text-whisper/70'}`}>
                                        {notifPermission === 'denied'
                                            ? t('notification.denied_hint')
                                            : t('notification.enable_hint')}
                                    </p>
                                    {notifPermission !== 'denied' && (
                                        <button
                                            type="button"
                                            onClick={requestNotifPermission}
                                            className="mt-1.5 text-[11px] font-semibold text-ember transition-colors hover:text-ember/80"
                                        >
                                            {t('notification.enable')} →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Project & category selectors */}
                        <div className="mb-6 space-y-3 rounded-2xl border border-boundary/40 bg-abyss/40 px-4 py-4">
                            {!isFocus && (
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bloom/60">
                                    {t('timer.next_pomodoro_hint')}
                                </p>
                            )}
                            <ItemSelect
                                label={t('project.label')}
                                items={projects}
                                value={selectedProjectId}
                                onChange={setSelectedProjectId}
                                storeRoute="projects.store"
                                noneKey="project.none"
                                createNewKey="project.create_new"
                                namePlaceholderKey="project.name_placeholder"
                                disabled={isFocus && isActive}
                            />
                            <CategoryMultiSelect
                                label={t('category.label')}
                                items={categories}
                                values={selectedCategoryIds}
                                onChange={setSelectedCategoryIds}
                                storeRoute="categories.store"
                                noneKey="category.none"
                                createNewKey="category.create_new"
                                namePlaceholderKey="category.name_placeholder"
                                selectedCountKey="category.selected"
                                disabled={isFocus && isActive}
                            />
                        </div>

                        {/* Action button */}
                        <div className="flex flex-col items-center gap-3">
                            {timerState === 'idle' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        className={`rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110 active:scale-95 ${
                                            isFocus ? 'bg-ember shadow-ember/30' : 'bg-bloom shadow-bloom/30'
                                        }`}
                                    >
                                        {t('timer.start')}
                                    </button>
                                    {!isFocus && (
                                        <button
                                            type="button"
                                            onClick={handleSkipBreak}
                                            className="text-[11px] font-medium text-whisper/40 transition-colors hover:text-whisper/70"
                                        >
                                            {t('timer.skip_break')} →
                                        </button>
                                    )}
                                </>
                            )}
                            {timerState === 'running' && (
                                <button
                                    type="button"
                                    onClick={handlePause}
                                    className="rounded-full border border-boundary bg-surface px-12 py-3 text-sm font-semibold uppercase tracking-widest text-moonbeam shadow-lg transition-all hover:border-whisper active:scale-95"
                                >
                                    {t('timer.pause')}
                                </button>
                            )}
                            {timerState === 'paused' && (
                                <button
                                    type="button"
                                    onClick={handleResume}
                                    className={`rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110 active:scale-95 ${
                                        isFocus ? 'bg-ember shadow-ember/30' : 'bg-bloom shadow-bloom/30'
                                    }`}
                                >
                                    {t('timer.resume')}
                                </button>
                            )}
                        </div>


                    </div>
                </div>
            </div>

            {settingsOpen && (
                <PomodoroSettingsModal
                    settings={settings}
                    onClose={() => setSettingsOpen(false)}
                    onSaved={(updated) => {
                        setSettings(updated);
                        if (mode === 'focus' && timerState !== 'idle') {
                            // Discard active focus session — no save, no sound, no notification
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                            }
                            autoStartNextRef.current = false;
                            const total = updated.pomodoro_duration * 60;
                            setRemaining(total);
                            setPhaseTotal(total);
                            setTimerState('idle');
                        } else if (timerState === 'idle') {
                            const total = mode === 'focus'
                                ? updated.pomodoro_duration * 60
                                : updated.break_duration * 60;
                            setRemaining(total);
                            setPhaseTotal(total);
                        }
                        // mode === 'break' && active → keep break running, new settings apply next phase
                    }}
                />
            )}

            {manageOpen && (
                <ManageItemsModal
                    projects={projects}
                    categories={categories}
                    onClose={() => setManageOpen(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
