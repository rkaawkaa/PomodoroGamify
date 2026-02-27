import CategoryMultiSelect from '@/Components/CategoryMultiSelect';
import GoalsModal from '@/Components/GoalsModal';
import ItemSelect from '@/Components/ItemSelect';
import LevelUpModal from '@/Components/LevelUpModal';
import ManageItemsModal from '@/Components/ManageItemsModal';
import PointsReward from '@/Components/PointsReward';
import PomodoroSettingsModal from '@/Components/PomodoroSettingsModal';
import TaskList from '@/Components/TaskList';
import { getLevelForPoints, Level } from '@/data/levels';
import { useTranslation } from '@/hooks/useTranslation';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, PageProps, PointAward, PomodoroSettings, Project, Task, UserGoal } from '@/types';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = PageProps<{
    pomodoroSettings: PomodoroSettings;
    projects: Project[];
    categories: Category[];
    tasks: Task[];
    goals: UserGoal[];
    todayCount: number;
    monthTotal: number;
    monthCounts: Record<string, number>;
    userPoints: number;
}>;

interface PendingReward {
    awards: PointAward[];
    totalEarned: number;
    userPoints: number;
}

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

// ─── Growing plant companion ────────────────────────────────────────────────
// Small animated plant that breathes during focus and sways during break.

const PLANT_KEYFRAMES = `
@keyframes plantBreathe {
    0%, 100% { transform: scale(1) translateY(0); }
    50%       { transform: scale(1.07) translateY(-3px); }
}
@keyframes plantSway {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    30%      { transform: rotate(-4deg) translateY(-2px); }
    70%      { transform: rotate(4deg) translateY(-2px); }
}
@keyframes plantIdle {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-1px); }
}`;

function GrowingPlant({ timerState, isFocus }: { timerState: TimerState; isFocus: boolean }) {
    const isRunning = timerState === 'running';
    const animation = isRunning && isFocus
        ? 'plantBreathe 4s ease-in-out infinite'
        : isRunning
        ? 'plantSway 7s ease-in-out infinite'
        : 'plantIdle 6s ease-in-out infinite';

    // Focus colours → ember-adjacent greens; break → bloom-adjacent purples
    const stem   = isFocus ? '#22c55e' : '#a78bfa';
    const leaf   = isFocus ? '#4ade80' : '#c4b5fd';
    const leafDk = isFocus ? '#16a34a' : '#8b5cf6';
    const head   = isFocus ? '#86efac' : '#ddd6fe';
    const face   = isFocus ? '#15803d' : '#5b21b6';
    const pot    = isFocus ? '#c2410c' : '#7c3aed';
    const potRim = isFocus ? '#ea580c' : '#9333ea';
    const soil   = isFocus ? '#78350f' : '#4c1d95';

    return (
        <div
            style={{
                width: 52,
                height: 52,
                animation,
                transformOrigin: 'center bottom',
                opacity: timerState === 'idle' ? 0.35 : 0.9,
                transition: 'opacity 1.2s ease',
                willChange: 'transform',
            }}
        >
            <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden="true">
                {/* pot */}
                <path d={`M16 42 L17.5 51 L34.5 51 L36 42 Z`} fill={pot}/>
                <rect x="14" y="39" width="24" height="5" rx="2" fill={potRim}/>
                <ellipse cx="26" cy="42" rx="10" ry="2.5" fill={soil}/>
                {/* stem */}
                <line x1="26" y1="42" x2="26" y2="26" stroke={stem} strokeWidth="2.5" strokeLinecap="round"/>
                {/* left leaf */}
                <ellipse cx="16.5" cy="34" rx="7" ry="3.5" fill={leafDk} transform="rotate(-30 16.5 34)"/>
                <ellipse cx="15.5" cy="33.5" rx="5" ry="2.5" fill={leaf} transform="rotate(-30 15.5 33.5)"/>
                {/* right leaf */}
                <ellipse cx="35.5" cy="34" rx="7" ry="3.5" fill={leafDk} transform="rotate(30 35.5 34)"/>
                <ellipse cx="36.5" cy="33.5" rx="5" ry="2.5" fill={leaf} transform="rotate(30 36.5 33.5)"/>
                {/* head */}
                <circle cx="26" cy="20" r="10" fill={head}/>
                {/* eyes */}
                <circle cx="22.5" cy="19" r="1.5" fill={face}/>
                <circle cx="29.5" cy="19" r="1.5" fill={face}/>
                {/* smile */}
                <path d="M22 23 Q26 27 30 23" stroke={face} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
        </div>
    );
}

export default function Dashboard({ pomodoroSettings, projects, categories, tasks: initialTasks, goals: initialGoals, todayCount: initialTodayCount, monthTotal: initialMonthTotal, monthCounts: initialMonthCounts, userPoints: initialUserPoints }: Props) {
    const { t } = useTranslation();

    // Modals
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [goalsOpen, setGoalsOpen] = useState(false);

    // Goals + points state (updated optimistically)
    const [goals, setGoals] = useState<UserGoal[]>(initialGoals);
    const [todayCount, setTodayCount] = useState(initialTodayCount);
    const [monthTotal, setMonthTotal] = useState(initialMonthTotal);
    const [monthCounts, setMonthCounts] = useState<Record<string, number>>(initialMonthCounts);
    const [userPoints, setUserPoints] = useState(initialUserPoints);
    const [pendingReward, setPendingReward] = useState<PendingReward | null>(null);
    const [pendingLevelUp, setPendingLevelUp] = useState<Level | null>(null);

    // Track previous points to detect level-up crossings
    const prevUserPointsRef = useRef(initialUserPoints);
    const updateUserPoints = useCallback((newPoints: number) => {
        const prevLevel = getLevelForPoints(prevUserPointsRef.current);
        const newLevel = getLevelForPoints(newPoints);
        prevUserPointsRef.current = newPoints;
        setUserPoints(newPoints);
        if (newLevel.level > prevLevel.level) {
            setPendingLevelUp(newLevel);
        }
    }, []);

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

    // --- Session start timestamp (set on first start/resume of a focus phase) ---
    const sessionStartAtRef = useRef<string | null>(null);

    // --- Task completion tracking (links tasks to the current focus session) ---
    const completedDuringSessionRef = useRef<number[]>([]);
    const handleTaskCompleted = useCallback((id: number) => {
        completedDuringSessionRef.current = [...completedDuringSessionRef.current, id];
    }, []);

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
        // Grab and clear completed task IDs before the async call
        const completedTaskIds = completedDuringSessionRef.current;
        completedDuringSessionRef.current = [];
        const startedAt = sessionStartAtRef.current;
        sessionStartAtRef.current = null;
        try {
            const res = await fetch(route('pomodoro-sessions.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    project_id: selectedProjectIdRef.current,
                    category_ids: selectedCategoryIdsRef.current,
                    completed_task_ids: completedTaskIds,
                    duration_seconds: durationSeconds,
                    started_at: startedAt,
                }),
            });

            // Increment counters optimistically (regardless of points)
            setTodayCount((c) => c + 1);
            setMonthTotal((c) => c + 1);
            if (selectedProjectIdRef.current) {
                const projKey = String(selectedProjectIdRef.current);
                setMonthCounts((prev) => ({ ...prev, [projKey]: (prev[projKey] ?? 0) + 1 }));
            }

            // Parse points awards from response
            if (res.ok) {
                const json = await res.json() as { awards: PointAward[]; total_earned: number; user_points: number };
                if (json.total_earned > 0) {
                    updateUserPoints(json.user_points);
                    setPendingReward({ awards: json.awards, totalEarned: json.total_earned, userPoints: json.user_points });
                }
            }
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
        if (natural || elapsed > 300) {
            saveSession(elapsed); // saveSession clears completedDuringSessionRef
        } else {
            completedDuringSessionRef.current = []; // discard without saving
        }
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
            if (modeRef.current === 'focus') {
                sessionStartAtRef.current = new Date().toISOString();
            }
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
    const handleStart = useCallback(() => {
        if (modeRef.current === 'focus') {
            sessionStartAtRef.current = new Date().toISOString();
        }
        setTimerState('running');
    }, []);
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
        <>
        <style>{PLANT_KEYFRAMES}</style>
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
                        <div className="relative mx-auto mb-3 flex h-48 w-48 items-center justify-center">
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

                        {/* Growing plant companion — breathes during focus, sways during break */}
                        <div className="mb-1 flex justify-center">
                            <GrowingPlant timerState={timerState} isFocus={isFocus} />
                        </div>

                        {/* Notification strip — compact, right below the ring */}
                        {notifPermission !== 'granted' && (
                            <div className={`mb-3 rounded-xl border px-3 py-2 ${
                                notifPermission === 'denied'
                                    ? 'border-boundary/60 bg-surface/40'
                                    : 'border-ember/40 bg-ember/10'
                            }`}>
                                {notifPermission === 'denied' ? (
                                    /* Denied: text only, multi-line */
                                    <p className="text-[10px] leading-relaxed text-whisper/60">
                                        {t('notification.denied_hint')}
                                    </p>
                                ) : (
                                    /* Default: icon + hint + action button */
                                    <div className="flex items-start gap-2">
                                        <svg className="mt-0.5 shrink-0 text-ember/70" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                        </svg>
                                        <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
                                            <span className="text-[10px] leading-snug text-whisper/70">
                                                {t('notification.enable_hint')}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={requestNotifPermission}
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                                                    isFocus
                                                        ? 'bg-ember/20 text-ember hover:bg-ember/35'
                                                        : 'bg-bloom/20 text-bloom hover:bg-bloom/35'
                                                }`}
                                            >
                                                {t('notification.enable')} →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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

                        {/* Task list */}
                        <TaskList
                            initialTasks={initialTasks}
                            isFocus={isFocus}
                            isSessionActive={isFocus && isActive}
                            onTaskCompleted={handleTaskCompleted}
                            onTaskAward={(awards, pts) => {
                                updateUserPoints(pts);
                                setPendingReward({ awards, totalEarned: awards.reduce((s, a) => s + a.points, 0), userPoints: pts });
                            }}
                        />

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

                {/* ── Goal progress strip ── */}
                {(() => {
                    const dailyGoal = goals.find((g) => g.period_type === 'daily') ?? null;
                    const monthlyGoals = goals.filter((g) => g.period_type === 'monthly');
                    const hasGoals = dailyGoal || monthlyGoals.length > 0;
                    if (!hasGoals) return null;

                    return (
                        <div className="mt-3 w-full max-w-xs space-y-2">
                            {/* Daily */}
                            {dailyGoal && (() => {
                                const done = todayCount;
                                const pct = Math.min(1, done / dailyGoal.target);
                                const reached = done >= dailyGoal.target;
                                return (
                                    <div className="rounded-xl border border-boundary/50 bg-depth/80 px-4 py-2.5">
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-whisper/60">
                                                {t('goals.today_progress')}
                                            </span>
                                            <span className={`text-[11px] font-bold tabular-nums ${reached ? 'text-bloom' : 'text-moonbeam/80'}`}>
                                                {reached ? `✓ ${t('goals.reached')}` : `${done} / ${dailyGoal.target}`}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full overflow-hidden rounded-full bg-boundary/40">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${reached ? 'bg-bloom' : 'bg-ember'}`}
                                                style={{ width: `${pct * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Monthly goals */}
                            {monthlyGoals.map((g) => {
                                const done = g.project_id === null
                                    ? monthTotal
                                    : (monthCounts[String(g.project_id)] ?? 0);
                                const pct = Math.min(1, done / g.target);
                                const reached = done >= g.target;
                                const label = g.project_id === null
                                    ? t('goals.global')
                                    : (g.project?.name ?? `#${g.project_id}`);
                                return (
                                    <div key={g.id} className="rounded-xl border border-boundary/50 bg-depth/80 px-4 py-2.5">
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-whisper/60">
                                                {t('goals.month_progress')} · {label}
                                            </span>
                                            <span className={`text-[11px] font-bold tabular-nums ${reached ? 'text-bloom' : 'text-moonbeam/80'}`}>
                                                {reached ? `✓ ${t('goals.reached')}` : `${done} / ${g.target}`}
                                            </span>
                                        </div>
                                        <div className="h-1 w-full overflow-hidden rounded-full bg-boundary/40">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${reached ? 'bg-bloom' : 'bg-aurora'}`}
                                                style={{ width: `${pct * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* ── Points badge + Goals button ── */}
                <div className="mt-3 flex items-center gap-2">
                    {/* Points counter pill */}
                    <div className="flex items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-2.5 py-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-ember/80">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        <span className="text-[10px] font-bold tabular-nums text-ember">
                            {userPoints.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-ember/60">{t('points.badge_label')}</span>
                    </div>

                    {/* Goals button */}
                    <button
                        type="button"
                        onClick={() => setGoalsOpen(true)}
                        className="flex items-center gap-1.5 rounded-full border border-boundary/50 bg-depth/60 px-3 py-1 text-whisper/50 transition-colors hover:border-whisper/40 hover:bg-depth hover:text-moonbeam"
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t('goals.button')}</span>
                    </button>
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
                            completedDuringSessionRef.current = [];
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

            {goalsOpen && (
                <GoalsModal
                    goals={goals}
                    projects={projects}
                    onClose={() => setGoalsOpen(false)}
                    onSaved={(updated) => setGoals(updated)}
                />
            )}

            {pendingReward && (
                <PointsReward
                    awards={pendingReward.awards}
                    totalEarned={pendingReward.totalEarned}
                    userPoints={pendingReward.userPoints}
                    onDismiss={() => setPendingReward(null)}
                />
            )}

            {pendingLevelUp && (
                <LevelUpModal
                    level={pendingLevelUp}
                    onDismiss={() => setPendingLevelUp(null)}
                />
            )}
        </AuthenticatedLayout>
        </>
    );
}
