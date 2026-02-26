import AppLogo from '@/Components/AppLogo';
import GuestSettingsModal from '@/Components/GuestSettingsModal';
import GuestTaskList from '@/Components/GuestTaskList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTranslation } from '@/hooks/useTranslation';
import { PageProps, PomodoroSettings, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Helpers ───────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0'); }

const CIRCUMFERENCE = 2 * Math.PI * 54;

const DEFAULT_SETTINGS: PomodoroSettings = {
    pomodoro_duration: 25,
    break_duration: 5,
    auto_start_breaks: false,
    auto_start_pomodoros: false,
};

type TimerMode  = 'focus' | 'break';
type TimerState = 'idle' | 'running' | 'paused';

// ─── Audio (Web Audio API, no asset files) ─────────────────────────────────
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
            beep(523, 0, 0.22); beep(659, 0.24, 0.22); beep(784, 0.48, 0.45);
        } else {
            beep(659, 0, 0.30); beep(523, 0.35, 0.45);
        }
    } catch { /* silent */ }
}

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
        chime(440, 0); chime(523, 0.6);
    } catch { /* silent */ }
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Welcome({ auth }: PageProps) {
    const { t, locale } = useTranslation();
    const user = (auth.user as User | null) ?? null;

    // ── Settings persisted in localStorage ───────────────────────────────
    const [settings, setSettings] = useLocalStorage<PomodoroSettings>(
        'pomobloom_guest_settings',
        DEFAULT_SETTINGS,
    );

    // ── Modal ─────────────────────────────────────────────────────────────
    const [settingsOpen, setSettingsOpen] = useState(false);

    // ── Timer state machine ───────────────────────────────────────────────
    const [mode, setMode]             = useState<TimerMode>('focus');
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [remaining, setRemaining]   = useState(settings.pomodoro_duration * 60);
    const [phaseTotal, setPhaseTotal] = useState(settings.pomodoro_duration * 60);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Stable refs
    const settingsRef   = useRef(settings);
    const modeRef       = useRef(mode);
    const remainingRef  = useRef(remaining);
    const phaseTotalRef = useRef(phaseTotal);
    useEffect(() => { settingsRef.current = settings; }, [settings]);
    useEffect(() => { modeRef.current = mode; }, [mode]);
    useEffect(() => { remainingRef.current = remaining; }, [remaining]);
    useEffect(() => { phaseTotalRef.current = phaseTotal; }, [phaseTotal]);

    const tRef = useRef(t);
    useEffect(() => { tRef.current = t; }, [t]);

    const autoStartNextRef = useRef(false);

    // ── Notifications ─────────────────────────────────────────────────────
    const swRegRef = useRef<ServiceWorkerRegistration | null>(null);
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    );

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => { swRegRef.current = reg; })
                .catch(() => {});
        }
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((r) => setNotifPermission(r));
        }
    }, []);

    const requestNotifPermission = useCallback(async () => {
        if (!('Notification' in window)) return;
        const r = await Notification.requestPermission();
        setNotifPermission(r);
    }, []);

    const notify = useCallback((title: string, body: string) => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        try {
            if (swRegRef.current) swRegRef.current.showNotification(title, { body, icon: '/favicon.ico' });
            else new Notification(title, { body, icon: '/favicon.ico' });
        } catch { /* silent */ }
    }, []);

    const notifyRef = useRef(notify);
    useEffect(() => { notifyRef.current = notify; }, [notify]);

    // ── Phase transitions ─────────────────────────────────────────────────
    const goToBreak = useCallback(() => {
        const s = settingsRef.current;
        const total = s.break_duration * 60;
        autoStartNextRef.current = s.auto_start_breaks;
        setMode('break'); setRemaining(total); setPhaseTotal(total); setTimerState('idle');
    }, []);

    const goToFocus = useCallback(() => {
        const s = settingsRef.current;
        const total = s.pomodoro_duration * 60;
        autoStartNextRef.current = s.auto_start_pomodoros;
        setMode('focus'); setRemaining(total); setPhaseTotal(total); setTimerState('idle');
    }, []);

    const goToBreakRef = useRef(goToBreak);
    const goToFocusRef = useRef(goToFocus);
    useEffect(() => { goToBreakRef.current = goToBreak; }, [goToBreak]);
    useEffect(() => { goToFocusRef.current = goToFocus; }, [goToFocus]);

    const endFocus = useCallback(() => {
        playSound('focus');
        notifyRef.current(tRef.current('notification.focus_title'), tRef.current('notification.focus_body'));
        goToBreakRef.current();
    }, []);

    const endBreak = useCallback(() => {
        playSound('break');
        notifyRef.current(tRef.current('notification.break_title'), tRef.current('notification.break_body'));
        goToFocusRef.current();
    }, []);

    const endFocusRef = useRef(endFocus);
    const endBreakRef = useRef(endBreak);
    useEffect(() => { endFocusRef.current = endFocus; }, [endFocus]);
    useEffect(() => { endBreakRef.current = endBreak; }, [endBreak]);

    // Auto-start next phase
    useEffect(() => {
        if (timerState === 'idle' && autoStartNextRef.current) {
            autoStartNextRef.current = false;
            setTimerState('running');
        }
    }, [timerState]);

    // 1-minute warning
    const warned1MinRef = useRef(false);
    useEffect(() => { warned1MinRef.current = false; }, [mode]);
    useEffect(() => {
        if (timerState !== 'running' || remaining !== 60 || warned1MinRef.current) return;
        if (phaseTotalRef.current <= 90) return;
        warned1MinRef.current = true;
        playWarningSound();
        if (modeRef.current === 'focus') {
            notifyRef.current(tRef.current('notification.focus_1min_title'), tRef.current('notification.focus_1min_body'));
        } else {
            notifyRef.current(tRef.current('notification.break_1min_title'), tRef.current('notification.break_1min_body'));
        }
    }, [remaining, timerState]);

    // Countdown tick
    useEffect(() => {
        if (timerState === 'running') {
            intervalRef.current = setInterval(() => {
                setRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setTimeout(() => {
                            if (modeRef.current === 'focus') endFocusRef.current();
                            else endBreakRef.current();
                        }, 400);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [timerState]);

    // Reset when settings change (idle only)
    useEffect(() => {
        if (timerState === 'idle') {
            const total = mode === 'focus'
                ? settings.pomodoro_duration * 60
                : settings.break_duration * 60;
            setRemaining(total); setPhaseTotal(total);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.pomodoro_duration, settings.break_duration]);

    // Tab title
    useEffect(() => {
        document.title = timerState !== 'idle'
            ? `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)} — ${t('app.name')}`
            : `Pomodoro — ${t('app.name')}`;
    }, [remaining, timerState]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // ── User actions ──────────────────────────────────────────────────────
    const handleStart   = useCallback(() => setTimerState('running'), []);
    const handlePause   = useCallback(() => setTimerState('paused'), []);
    const handleResume  = useCallback(() => setTimerState('running'), []);
    const handleSkipBreak = useCallback(() => {
        const total = settingsRef.current.pomodoro_duration * 60;
        setMode('focus'); setRemaining(total); setPhaseTotal(total); setTimerState('idle');
    }, []);
    const handleStop = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        if (modeRef.current === 'focus') endFocusRef.current();
        else endBreakRef.current();
    }, []);

    // ── Derived ───────────────────────────────────────────────────────────
    const isFocus    = mode === 'focus';
    const isActive   = timerState !== 'idle';
    const minutes    = Math.floor(remaining / 60);
    const seconds    = remaining % 60;
    const progress   = phaseTotal > 0 ? remaining / phaseTotal : 1;
    const dashOffset = CIRCUMFERENCE * (1 - progress);

    return (
        <>
            <Head title={`Pomodoro — ${t('app.name')}`} />

            <div className="flex min-h-screen flex-col bg-abyss bg-gradient-to-b from-ember/[0.10] via-transparent to-bloom/[0.07]">

                {/* ── Top bar ─────────────────────────────────────────────── */}
                <header className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2.5 text-ember">
                        <AppLogo size={22} />
                        <span className="text-sm font-bold tracking-tight text-moonbeam">
                            {t('app.name')}
                        </span>
                    </div>

                    <nav className="flex items-center gap-2">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-ember/40 bg-ember/10 px-3 py-1.5 text-xs font-semibold text-ember transition-all hover:bg-ember/20"
                            >
                                {t('nav.dashboard')} →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-boundary/60 px-3 py-1.5 text-xs font-medium text-whisper transition-all hover:border-whisper/50 hover:text-moonbeam"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-ember px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
                                >
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* ── Timer area ──────────────────────────────────────────── */}
                <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-4">

                    <div className="w-full max-w-xs rounded-3xl border border-whisper/10 bg-depth shadow-2xl shadow-black/70">

                        {/* Top gradient accent */}
                        <div className="relative h-0.5 overflow-hidden rounded-t-3xl">
                            <div className={`absolute inset-0 bg-gradient-to-r from-ember via-bloom/50 to-ember transition-opacity duration-700 ${isFocus ? 'opacity-100' : 'opacity-0'}`} />
                            <div className={`absolute inset-0 bg-gradient-to-r from-bloom/80 via-bloom/30 to-bloom/80 transition-opacity duration-700 ${isFocus ? 'opacity-0' : 'opacity-100'}`} />
                        </div>

                        <div className="px-8 pb-8 pt-6">

                            {/* Header row */}
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

                            {/* Notification strip */}
                            {notifPermission !== 'granted' && (
                                <div className={`mb-3 rounded-xl border px-3 py-2 ${
                                    notifPermission === 'denied'
                                        ? 'border-boundary/60 bg-surface/40'
                                        : 'border-ember/40 bg-ember/10'
                                }`}>
                                    {notifPermission === 'denied' ? (
                                        <p className="text-[10px] leading-relaxed text-whisper/60">
                                            {t('notification.denied_hint')}
                                        </p>
                                    ) : (
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

                            {/* Stop/skip button */}
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
                            <GuestTaskList isFocus={isFocus} />

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

                    {/* Upsell banner — outside the timer card, guests only */}
                    {!user && (
                        <div className="mt-5 w-full max-w-xs rounded-2xl border border-boundary/50 bg-surface/20 px-5 py-4 text-center">
                            <p className="mb-3 text-[11px] leading-relaxed text-whisper/60">
                                {locale === 'fr'
                                    ? 'Crée un compte gratuit pour sauvegarder tes sessions, gérer projets & catégories et suivre tes stats.'
                                    : 'Create a free account to save your sessions, manage projects & categories, and track your stats.'}
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-full bg-ember px-5 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
                            >
                                {t('auth.register.submit')} →
                            </Link>
                        </div>
                    )}
                </main>
            </div>

            {/* Settings modal */}
            {settingsOpen && (
                <GuestSettingsModal
                    settings={settings}
                    onClose={() => setSettingsOpen(false)}
                    onSaved={(updated) => {
                        setSettings(updated);
                        if (timerState === 'idle') {
                            const total = mode === 'focus'
                                ? updated.pomodoro_duration * 60
                                : updated.break_duration * 60;
                            setRemaining(total);
                            setPhaseTotal(total);
                        }
                    }}
                />
            )}
        </>
    );
}
