/**
 * Themed animated mascot displayed under the timer ring.
 * Replaces the inline GrowingPlant component from Dashboard.tsx.
 */
import { useTheme } from '@/hooks/useTheme';

type TimerState = 'idle' | 'running' | 'paused';

interface Props {
    timerState: TimerState;
    isFocus: boolean;
}

const KEYFRAMES = `
@keyframes timerBreathe {
    0%, 100% { transform: scale(1) translateY(0); }
    50%       { transform: scale(1.07) translateY(-3px); }
}
@keyframes timerSway {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    30%      { transform: rotate(-4deg) translateY(-2px); }
    70%      { transform: rotate(4deg) translateY(-2px); }
}
@keyframes timerIdle {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-1.5px); }
}
@keyframes timerBob {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25%      { transform: translateY(-4px) rotate(-3deg); }
    75%      { transform: translateY(-2px) rotate(3deg); }
}
@keyframes timerFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-5px) scale(1.04); }
}`;

function useAnimation(timerState: TimerState, isFocus: boolean, breathe = 'timerBreathe', sway = 'timerSway', idle = 'timerIdle') {
    const isRunning = timerState === 'running';
    return isRunning && isFocus
        ? `${breathe} 4s ease-in-out infinite`
        : isRunning
        ? `${sway} 7s ease-in-out infinite`
        : `${idle} 5s ease-in-out infinite`;
}

// ─── Plant ──────────────────────────────────────────────────────────────────
function PlantMascot({ timerState, isFocus }: Props) {
    const stem   = isFocus ? '#22c55e' : '#a78bfa';
    const leaf   = isFocus ? '#4ade80' : '#c4b5fd';
    const leafDk = isFocus ? '#16a34a' : '#8b5cf6';
    const head   = isFocus ? '#86efac' : '#ddd6fe';
    const face   = isFocus ? '#15803d' : '#5b21b6';
    const pot    = isFocus ? '#c2410c' : '#7c3aed';
    const potRim = isFocus ? '#ea580c' : '#9333ea';
    const soil   = isFocus ? '#78350f' : '#4c1d95';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            <path d="M16 42 L17.5 51 L34.5 51 L36 42 Z" fill={pot}/>
            <rect x="14" y="39" width="24" height="5" rx="2" fill={potRim}/>
            <ellipse cx="26" cy="42" rx="10" ry="2.5" fill={soil}/>
            <line x1="26" y1="42" x2="26" y2="26" stroke={stem} strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="16.5" cy="34" rx="7" ry="3.5" fill={leafDk} transform="rotate(-30 16.5 34)"/>
            <ellipse cx="15.5" cy="33.5" rx="5" ry="2.5" fill={leaf} transform="rotate(-30 15.5 33.5)"/>
            <ellipse cx="35.5" cy="34" rx="7" ry="3.5" fill={leafDk} transform="rotate(30 35.5 34)"/>
            <ellipse cx="36.5" cy="33.5" rx="5" ry="2.5" fill={leaf} transform="rotate(30 36.5 33.5)"/>
            <circle cx="26" cy="20" r="10" fill={head}/>
            <circle cx="22.5" cy="19" r="1.5" fill={face}/>
            <circle cx="29.5" cy="19" r="1.5" fill={face}/>
            <path d="M22 23 Q26 27 30 23" stroke={face} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
    );
}

// ─── Warrior ────────────────────────────────────────────────────────────────
function WarriorMascot({ timerState, isFocus }: Props) {
    const helmColor = isFocus ? '#9f1239' : '#1e40af';
    const armorColor = isFocus ? '#b91c1c' : '#1d4ed8';
    const swordColor = '#c0c0c0';
    const goldColor = '#d4a017';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* helmet */}
            <path d="M14 20 Q14 10 26 10 Q38 10 38 20 L38 24 L14 24 Z" fill={helmColor}/>
            <rect x="21" y="21" width="10" height="4" rx="1" fill="#1a1a1a"/>
            {/* plume */}
            {isFocus && <path d="M24 10 Q26 6 28 10" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
            {!isFocus && <path d="M24 10 Q26 6 28 10" stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
            {/* body */}
            <rect x="16" y="24" width="20" height="18" rx="3" fill={armorColor}/>
            <line x1="26" y1="24" x2="26" y2="42" stroke={helmColor} strokeWidth="1"/>
            {/* pauldrons */}
            <ellipse cx="12" cy="27" rx="5" ry="4" fill={armorColor}/>
            <ellipse cx="40" cy="27" rx="5" ry="4" fill={armorColor}/>
            {/* legs */}
            <rect x="16" y="42" width="8" height="8" rx="2" fill={helmColor}/>
            <rect x="28" y="42" width="8" height="8" rx="2" fill={helmColor}/>
            {/* sword raised in focus, resting in break */}
            {isFocus ? (
                <>
                    <rect x="38" y="8" width="2.5" height="20" rx="1" fill={swordColor}/>
                    <rect x="35.5" y="12" width="7" height="2" rx="1" fill={goldColor}/>
                </>
            ) : (
                <>
                    <rect x="38" y="24" width="2.5" height="20" rx="1" fill={swordColor}/>
                    <rect x="35.5" y="28" width="7" height="2" rx="1" fill={goldColor}/>
                </>
            )}
            {/* shield */}
            <path d="M6 22 L12 20 L12 36 Q9 40 6 36 Z" fill={isFocus ? '#dc2626' : '#2563eb'}/>
        </svg>
    );
}

// ─── Scientist ───────────────────────────────────────────────────────────────
function ScientistMascot({ timerState, isFocus }: Props) {
    const coatColor = isFocus ? '#e0f2fe' : '#ede9fe';
    const accentColor = isFocus ? '#0284c7' : '#7c3aed';
    const flaskColor = isFocus ? '#06b6d4' : '#8b5cf6';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* head */}
            <circle cx="26" cy="17" r="10" fill="#fde68a"/>
            {/* glasses */}
            <circle cx="22" cy="16" r="3.5" fill="none" stroke="#64748b" strokeWidth="1.2"/>
            <circle cx="30" cy="16" r="3.5" fill="none" stroke="#64748b" strokeWidth="1.2"/>
            <line x1="25.5" y1="16" x2="26.5" y2="16" stroke="#64748b" strokeWidth="1"/>
            <circle cx="22.5" cy="16.5" r="1.2" fill="#1e3a8a"/>
            <circle cx="30.5" cy="16.5" r="1.2" fill="#1e3a8a"/>
            <path d="M22 21 Q26 24 30 21" stroke="#1e3a8a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            {/* lab coat */}
            <rect x="14" y="27" width="24" height="18" rx="4" fill={coatColor}/>
            <rect x="21" y="27" width="10" height="4" fill="#cbd5e1"/>
            <line x1="26" y1="31" x2="26" y2="45" stroke="#cbd5e1" strokeWidth="0.8"/>
            {/* flask - glows in focus (active) */}
            {isFocus ? (
                <>
                    <path d="M36 24 L40 24 L44 36 Q46 42 43 44 Q40 46 38 42 Z" fill={`${flaskColor}60`}/>
                    <rect x="36" y="22" width="8" height="3" rx="1" fill="#94a3b8"/>
                    <ellipse cx="41" cy="40" rx="3.5" ry="2" fill={flaskColor} opacity="0.9"/>
                    <circle cx="40" cy="35" r="2" fill={flaskColor} opacity="0.7"/>
                    <circle cx="41" cy="30" r="1" fill={flaskColor} opacity="0.5"/>
                </>
            ) : (
                <>
                    <path d="M36 24 L40 24 L44 36 Q46 42 43 44 Q40 46 38 42 Z" fill={`${flaskColor}40`}/>
                    <rect x="36" y="22" width="8" height="3" rx="1" fill="#94a3b8"/>
                    <ellipse cx="41" cy="40" rx="3.5" ry="2" fill={flaskColor} opacity="0.5"/>
                </>
            )}
            {/* legs */}
            <rect x="16" y="45" width="7" height="7" rx="2" fill={accentColor}/>
            <rect x="29" y="45" width="7" height="7" rx="2" fill={accentColor}/>
        </svg>
    );
}

// ─── Medieval ────────────────────────────────────────────────────────────────
function MedievalMascot({ timerState, isFocus }: Props) {
    const robe = isFocus ? '#7c2d12' : '#312e81';
    const accent = isFocus ? '#d97706' : '#6d28d9';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* wizard/mage hood */}
            <path d="M10 22 Q18 4 26 2 Q34 4 42 22" fill={robe}/>
            <path d="M26 2 Q28 -4 30 2" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="30" cy="1" r="2" fill={isFocus ? '#f59e0b' : '#a78bfa'}/>
            {/* face */}
            <circle cx="26" cy="20" r="10" fill="#fde68a"/>
            <circle cx="22.5" cy="19" r="1.5" fill="#5a3a1a"/>
            <circle cx="29.5" cy="19" r="1.5" fill="#5a3a1a"/>
            <path d="M22 23 Q26 26 30 23" stroke="#5a3a1a" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            {/* beard */}
            <path d="M20 25 Q26 32 32 25" stroke="#d1d5db" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* robe body */}
            <rect x="14" y="30" width="24" height="18" rx="6" fill={robe}/>
            <rect x="21" y="30" width="10" height="4" rx="2" fill={accent}/>
            {/* staff */}
            <line x1="42" y1="10" x2="44" y2="50" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="42" cy="10" r="4" fill={accent}/>
            <circle cx="42" cy="10" r="2" fill={isFocus ? '#fde68a' : '#c4b5fd'}/>
            {/* magic sparkles in focus */}
            {isFocus && (
                <>
                    <circle cx="6" cy="24" r="1.5" fill="#f59e0b" opacity="0.8"/>
                    <circle cx="8" cy="18" r="1" fill="#fde68a" opacity="0.6"/>
                    <circle cx="4" cy="14" r="1" fill="#d97706" opacity="0.7"/>
                </>
            )}
            {!isFocus && (
                <>
                    <circle cx="6" cy="24" r="1.5" fill="#a78bfa" opacity="0.8"/>
                    <circle cx="8" cy="18" r="1" fill="#c4b5fd" opacity="0.6"/>
                    <circle cx="4" cy="14" r="1" fill="#7c3aed" opacity="0.7"/>
                </>
            )}
        </svg>
    );
}

// ─── Space ───────────────────────────────────────────────────────────────────
function SpaceMascot({ timerState, isFocus }: Props) {
    const suit = isFocus ? '#4c1d95' : '#1e3a8a';
    const visor = isFocus ? '#7c3aed80' : '#1d4ed880';
    const accent = isFocus ? '#a78bfa' : '#60a5fa';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* stars */}
            <circle cx="4" cy="6" r="1" fill="#e0e7ff"/>
            <circle cx="46" cy="4" r="1.2" fill="#e0e7ff"/>
            <circle cx="48" cy="28" r="0.8" fill="#e0e7ff"/>
            <circle cx="2" cy="36" r="1" fill="#e0e7ff"/>
            {/* helmet */}
            <circle cx="26" cy="17" r="13" fill="#d1d5db"/>
            <ellipse cx="26" cy="17" rx="9" ry="7" fill="#bfdbfe" opacity="0.4"/>
            <ellipse cx="26" cy="17" rx="6" ry="5" fill={visor}/>
            <circle cx="23" cy="14" r="1.2" fill="white" opacity="0.7"/>
            {/* antenna */}
            <line x1="26" y1="4" x2="26" y2="8" stroke="#9ca3af" strokeWidth="1.5"/>
            <circle cx="26" cy="3" r="1.8" fill={isFocus ? '#f59e0b' : '#22d3ee'}/>
            {/* suit */}
            <rect x="14" y="30" width="24" height="18" rx="6" fill={suit}/>
            <rect x="20" y="34" width="12" height="7" rx="1.5" fill="#1f2937"/>
            <circle cx="23" cy="37.5" r="1.2" fill="#22d3ee"/>
            <circle cx="26" cy="37.5" r="1.2" fill={isFocus ? '#f59e0b' : '#4ade80'}/>
            <circle cx="29" cy="37.5" r="1.2" fill="#ef4444"/>
            {/* jetpack */}
            <rect x="38" y="30" width="7" height="14" rx="3" fill={accent}/>
            {/* floating effect in running state */}
            {timerState === 'running' && (
                <>
                    <ellipse cx="20" cy="50" rx="3" ry="1.5" fill={accent} opacity="0.4"/>
                    <ellipse cx="32" cy="50" rx="3" ry="1.5" fill={accent} opacity="0.4"/>
                </>
            )}
            {/* legs */}
            <rect x="16" y="48" width="8" height="4" rx="2" fill="#9ca3af"/>
            <rect x="28" y="48" width="8" height="4" rx="2" fill="#9ca3af"/>
        </svg>
    );
}

// ─── Girly / Kawaii ──────────────────────────────────────────────────────────
function GirlyMascot({ timerState, isFocus }: Props) {
    const mainColor = isFocus ? '#f472b6' : '#a855f7';
    const lightColor = isFocus ? '#fce7f3' : '#f3e8ff';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* sparkles */}
            {isFocus && (
                <>
                    <text x="0" y="12" fontSize="8" fill="#f9a8d4">✦</text>
                    <text x="40" y="8" fontSize="6" fill="#c084fc">✦</text>
                </>
            )}
            {!isFocus && (
                <>
                    <text x="0" y="12" fontSize="8" fill="#c084fc">✦</text>
                    <text x="40" y="8" fontSize="6" fill="#f9a8d4">✦</text>
                </>
            )}
            {/* wings */}
            <path d="M16 22 Q4 14 6 28 Q10 36 18 32 Z" fill={`${mainColor}80`}/>
            <path d="M36 22 Q48 14 46 28 Q42 36 34 32 Z" fill={`${mainColor}80`}/>
            {/* horn */}
            <path d="M26 4 L23 14 L29 14 Z" fill="#d4a017"/>
            {/* head */}
            <circle cx="26" cy="18" r="11" fill={lightColor}/>
            <circle cx="22" cy="16" r="2" fill={mainColor}/>
            <circle cx="30" cy="16" r="2" fill={mainColor}/>
            <path d="M21 21 Q26 25 31 21" stroke={mainColor} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* blush */}
            <ellipse cx="18.5" cy="19" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            <ellipse cx="33.5" cy="19" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            {/* dress body */}
            <path d="M14 29 Q26 25 38 29 L40 50 Q26 54 12 50 Z" fill={mainColor} opacity="0.9"/>
            <path d="M14 29 Q26 25 38 29 L38 36 Q26 32 14 36 Z" fill="#ffffff" opacity="0.3"/>
            {/* wand */}
            <line x1="42" y1="16" x2="48" y2="44" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="42" cy="16" r="4" fill="#fbbf24"/>
            <circle cx="42" cy="16" r="2" fill="white" opacity="0.8"/>
        </svg>
    );
}

// ─── Animals ─────────────────────────────────────────────────────────────────
function AnimalsMascot({ timerState, isFocus }: Props) {
    const earColor = isFocus ? '#f97316' : '#d97706';
    const bodyColor = isFocus ? '#f97316' : '#d97706';
    const innerColor = isFocus ? '#fde68a' : '#fef3c7';
    return (
        <svg viewBox="0 0 52 52" width={52} height={52} fill="none" aria-hidden>
            {/* fox ears */}
            <path d="M14 14 L10 4 L22 12 Z" fill={earColor}/>
            <path d="M15 14 L12 6 L20 12 Z" fill={innerColor}/>
            <path d="M38 14 L42 4 L30 12 Z" fill={earColor}/>
            <path d="M37 14 L40 6 L32 12 Z" fill={innerColor}/>
            {/* head */}
            <circle cx="26" cy="20" r="12" fill={bodyColor}/>
            <ellipse cx="26" cy="24" rx="7" ry="5" fill={innerColor}/>
            {/* eyes */}
            <circle cx="21.5" cy="18" r="2.5" fill="#1f2937"/>
            <circle cx="30.5" cy="18" r="2.5" fill="#1f2937"/>
            <circle cx="22" cy="17.5" r="0.8" fill="white"/>
            <circle cx="31" cy="17.5" r="0.8" fill="white"/>
            {/* nose */}
            <ellipse cx="26" cy="24" rx="2" ry="1.2" fill="#1f2937"/>
            {/* blush */}
            <ellipse cx="17" cy="21" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6"/>
            <ellipse cx="35" cy="21" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6"/>
            {/* body */}
            <ellipse cx="26" cy="40" rx="12" ry="10" fill={bodyColor}/>
            <ellipse cx="26" cy="40" rx="7" ry="6" fill={innerColor}/>
            {/* tail */}
            <path d="M38 36 Q50 30 50 42 Q48 50 40 48" stroke={bodyColor} strokeWidth="5" fill="none" strokeLinecap="round"/>
            <ellipse cx="46" cy="46" rx="5" ry="3.5" fill="white" transform="rotate(-20 46 46)"/>
            {/* feet */}
            <ellipse cx="20" cy="49" rx="5" ry="3.5" fill={bodyColor}/>
            <ellipse cx="32" cy="49" rx="5" ry="3.5" fill={bodyColor}/>
        </svg>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────
const MASCOTS: Record<string, React.FC<Props>> = {
    plant:     PlantMascot,
    warrior:   WarriorMascot,
    scientist: ScientistMascot,
    medieval:  MedievalMascot,
    space:     SpaceMascot,
    girly:     GirlyMascot,
    animals:   AnimalsMascot,
};

const ANIMATION_STYLE: Record<string, { breathe?: string; sway?: string }> = {
    space:   { breathe: 'timerFloat', sway: 'timerBob' },
    girly:   { breathe: 'timerBob',   sway: 'timerFloat' },
    animals: { sway: 'timerBob' },
};

export default function TimerIllustration({ timerState, isFocus }: Props) {
    const { theme } = useTheme();
    const MascotComponent = MASCOTS[theme.id] ?? PlantMascot;
    const anim = ANIMATION_STYLE[theme.id] ?? {};
    const animation = useAnimation(
        timerState, isFocus,
        anim.breathe ?? 'timerBreathe',
        anim.sway    ?? 'timerSway',
        'timerIdle',
    );

    return (
        <>
            <style>{KEYFRAMES}</style>
            <div
                style={{
                    width: 52,
                    height: 52,
                    animation,
                    transformOrigin: 'center bottom',
                    opacity: timerState === 'idle' ? 0.35 : 0.92,
                    transition: 'opacity 1.2s ease',
                    willChange: 'transform',
                }}
            >
                <MascotComponent timerState={timerState} isFocus={isFocus} />
            </div>
        </>
    );
}
