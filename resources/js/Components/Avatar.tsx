/**
 * Themed avatar component — replaces PlantAvatar.
 * Plant theme delegates to PlantAvatar (20 unique designs).
 * Other themes use 5 tiers (4 levels per tier).
 */
import PlantAvatar from '@/Components/PlantAvatar';
import { useTheme } from '@/hooks/useTheme';

interface Props {
    level: number;
    size?: number;
}

// tier 1 = levels 1-4, tier 2 = 5-8, tier 3 = 9-12, tier 4 = 13-16, tier 5 = 17-20
function getTier(level: number): 1 | 2 | 3 | 4 | 5 {
    return Math.min(5, Math.ceil(level / 4)) as 1 | 2 | 3 | 4 | 5;
}

// ─── Warrior ────────────────────────────────────────────────────────────────
function WarriorT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* head */}
            <circle cx="32" cy="18" r="10" fill="#f5deb3"/>
            <circle cx="28.5" cy="17" r="1.5" fill="#5a3a1a"/>
            <circle cx="35.5" cy="17" r="1.5" fill="#5a3a1a"/>
            <path d="M28 22 Q32 25.5 36 22" stroke="#5a3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* simple tunic */}
            <rect x="24" y="28" width="16" height="18" rx="3" fill="#c0392b"/>
            {/* belt */}
            <rect x="24" y="38" width="16" height="3" rx="1" fill="#7b3a1a"/>
            <rect x="30" y="37" width="4" height="5" rx="1" fill="#d4a017"/>
            {/* legs */}
            <rect x="24" y="46" width="7" height="12" rx="2" fill="#8b4513"/>
            <rect x="33" y="46" width="7" height="12" rx="2" fill="#8b4513"/>
            {/* spear */}
            <line x1="48" y1="12" x2="44" y2="52" stroke="#8b6914" strokeWidth="2.5" strokeLinecap="round"/>
            <polygon points="48,12 44,18 51,16" fill="#c0c0c0"/>
        </svg>
    );
}

function WarriorT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* helmet */}
            <path d="M20 18 Q20 8 32 8 Q44 8 44 18 L44 22 Q38 26 32 26 Q26 26 20 22 Z" fill="#a0a0a0"/>
            <rect x="27" y="19" width="10" height="5" rx="1" fill="#555"/>
            {/* body armor */}
            <rect x="22" y="26" width="20" height="20" rx="3" fill="#808080"/>
            <line x1="32" y1="26" x2="32" y2="46" stroke="#666" strokeWidth="1"/>
            {/* shoulder guards */}
            <ellipse cx="19" cy="30" rx="5" ry="4" fill="#909090"/>
            <ellipse cx="45" cy="30" rx="5" ry="4" fill="#909090"/>
            {/* legs */}
            <rect x="22" y="46" width="8" height="14" rx="2" fill="#606060"/>
            <rect x="34" y="46" width="8" height="14" rx="2" fill="#606060"/>
            {/* sword */}
            <rect x="46" y="24" width="3" height="22" rx="1" fill="#c0c0c0"/>
            <rect x="43" y="28" width="9" height="2" rx="1" fill="#8b6914"/>
            <rect x="47" y="22" width="2" height="5" rx="1" fill="#8b6914"/>
        </svg>
    );
}

function WarriorT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* full helm with plume */}
            <path d="M18 20 Q18 8 32 8 Q46 8 46 20 L46 26 L18 26 Z" fill="#888"/>
            <rect x="26" y="20" width="12" height="5" rx="1" fill="#444"/>
            {/* plume */}
            <path d="M30 8 Q32 2 34 8" stroke="#c0392b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* full plate body */}
            <rect x="19" y="26" width="26" height="22" rx="4" fill="#777"/>
            <path d="M19 36 Q32 32 45 36" stroke="#555" strokeWidth="1" fill="none"/>
            {/* pauldrons */}
            <ellipse cx="15" cy="30" rx="6" ry="5" fill="#888"/>
            <ellipse cx="49" cy="30" rx="6" ry="5" fill="#888"/>
            {/* legs */}
            <rect x="20" y="48" width="9" height="13" rx="2" fill="#666"/>
            <rect x="35" y="48" width="9" height="13" rx="2" fill="#666"/>
            {/* shield left */}
            <path d="M8 28 L14 26 L14 44 Q11 48 8 44 Z" fill="#c0392b"/>
            <path d="M8 28 L14 26 L14 44 Q11 48 8 44 Z" fill="none" stroke="#7b0000" strokeWidth="1"/>
            {/* sword right */}
            <rect x="50" y="18" width="3" height="26" rx="1" fill="#d4d4d4"/>
            <rect x="47" y="22" width="9" height="2.5" rx="1" fill="#8b6914"/>
        </svg>
    );
}

function WarriorT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* crowned helm */}
            <path d="M18 20 Q18 8 32 8 Q46 8 46 20 L46 26 L18 26 Z" fill="#777"/>
            <rect x="26" y="20" width="12" height="5" rx="1" fill="#333"/>
            {/* crown */}
            <rect x="21" y="4" width="22" height="5" rx="1" fill="#d4a017"/>
            <polygon points="24,4 24,0 27,4" fill="#d4a017"/>
            <polygon points="30,4 32,0 34,4" fill="#d4a017"/>
            <polygon points="37,4 40,0 40,4" fill="#d4a017"/>
            {/* golden armor */}
            <rect x="18" y="26" width="28" height="22" rx="4" fill="#8B6914"/>
            <path d="M18 36 Q32 31 46 36" stroke="#d4a017" strokeWidth="1.5" fill="none"/>
            {/* epic pauldrons */}
            <ellipse cx="13" cy="30" rx="8" ry="6" fill="#8B6914"/>
            <ellipse cx="51" cy="30" rx="8" ry="6" fill="#8B6914"/>
            {/* cape */}
            <path d="M18 28 Q10 40 12 58 L18 58 L18 48 Z" fill="#8b0000" opacity="0.9"/>
            <path d="M46 28 Q54 40 52 58 L46 58 L46 48 Z" fill="#8b0000" opacity="0.9"/>
            {/* legs */}
            <rect x="20" y="48" width="9" height="13" rx="2" fill="#6B5000"/>
            <rect x="35" y="48" width="9" height="13" rx="2" fill="#6B5000"/>
            {/* dual swords */}
            <rect x="6" y="20" width="2.5" height="22" rx="1" fill="#d4d4d4"/>
            <rect x="3.5" y="24" width="7" height="2" rx="1" fill="#d4a017"/>
            <rect x="55" y="20" width="2.5" height="22" rx="1" fill="#d4d4d4"/>
            <rect x="52.5" y="24" width="7" height="2" rx="1" fill="#d4a017"/>
        </svg>
    );
}

function WarriorT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* divine aura */}
            <circle cx="32" cy="30" r="28" fill="#d4a01720" />
            <circle cx="32" cy="30" r="22" fill="#d4a01715" />
            {/* wings */}
            <path d="M18 26 Q2 18 4 38 Q8 44 18 40 Z" fill="#d4a017" opacity="0.7"/>
            <path d="M46 26 Q62 18 60 38 Q56 44 46 40 Z" fill="#d4a017" opacity="0.7"/>
            {/* helm */}
            <path d="M18 20 Q18 8 32 8 Q46 8 46 20 L46 26 L18 26 Z" fill="#8B6914"/>
            <rect x="26" y="20" width="12" height="5" rx="1" fill="#333"/>
            {/* divine crown */}
            <rect x="19" y="3" width="26" height="6" rx="2" fill="#d4a017"/>
            <polygon points="22,3 22,-2 26,3" fill="#d4a017"/>
            <polygon points="30,3 32,-1 34,3" fill="#d4a017"/>
            <polygon points="38,3 42,-2 42,3" fill="#d4a017"/>
            <circle cx="32" cy="1" r="2" fill="#ff4444"/>
            {/* legendary armor */}
            <rect x="18" y="26" width="28" height="22" rx="4" fill="#8B6914"/>
            <path d="M18 36 Q32 30 46 36" stroke="#d4a017" strokeWidth="2" fill="none"/>
            <circle cx="32" cy="32" r="4" fill="#d4a017"/>
            {/* pauldrons */}
            <ellipse cx="12" cy="29" rx="9" ry="7" fill="#8B6914"/>
            <ellipse cx="52" cy="29" rx="9" ry="7" fill="#8B6914"/>
            {/* legs */}
            <rect x="20" y="48" width="9" height="14" rx="2" fill="#6B5000"/>
            <rect x="35" y="48" width="9" height="14" rx="2" fill="#6B5000"/>
            {/* legendary sword (center, raised) */}
            <rect x="30.5" y="6" width="3" height="30" rx="1.5" fill="#e8e8e8"/>
            <rect x="26" y="14" width="12" height="3" rx="1.5" fill="#d4a017"/>
        </svg>
    );
}

// ─── Scientist ───────────────────────────────────────────────────────────────
function ScientistT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* graduation cap */}
            <rect x="20" y="8" width="24" height="4" rx="1" fill="#1a1a2e"/>
            <polygon points="32,4 44,8 20,8" fill="#1a1a2e"/>
            <line x1="44" y1="8" x2="46" y2="14" stroke="#1a1a2e" strokeWidth="1.5"/>
            <circle cx="46" cy="15" r="2" fill="#3b82f6"/>
            {/* head */}
            <circle cx="32" cy="20" r="10" fill="#fde68a"/>
            <circle cx="28.5" cy="19" r="1.5" fill="#1e3a8a"/>
            <circle cx="35.5" cy="19" r="1.5" fill="#1e3a8a"/>
            <path d="M28 24 Q32 27 36 24" stroke="#1e3a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* glasses */}
            <circle cx="28.5" cy="19" r="3" fill="none" stroke="#334155" strokeWidth="1"/>
            <circle cx="35.5" cy="19" r="3" fill="none" stroke="#334155" strokeWidth="1"/>
            <line x1="31.5" y1="19" x2="32.5" y2="19" stroke="#334155" strokeWidth="1"/>
            {/* lab coat */}
            <rect x="22" y="30" width="20" height="20" rx="3" fill="#e0f2fe"/>
            <rect x="27" y="30" width="10" height="4" fill="#bfdbfe"/>
            {/* book */}
            <rect x="38" y="34" width="10" height="12" rx="1" fill="#3b82f6"/>
            <line x1="43" y1="34" x2="43" y2="46" stroke="#1d4ed8" strokeWidth="1"/>
            {/* legs */}
            <rect x="24" y="50" width="7" height="10" rx="2" fill="#1e3a8a"/>
            <rect x="33" y="50" width="7" height="10" rx="2" fill="#1e3a8a"/>
        </svg>
    );
}

function ScientistT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* head with goggles */}
            <circle cx="32" cy="18" r="10" fill="#fde68a"/>
            <circle cx="27" cy="16" r="4" fill="none" stroke="#475569" strokeWidth="2"/>
            <circle cx="37" cy="16" r="4" fill="none" stroke="#475569" strokeWidth="2"/>
            <line x1="31" y1="16" x2="33" y2="16" stroke="#475569" strokeWidth="2"/>
            <line x1="23" y1="16" x2="20" y2="15" stroke="#475569" strokeWidth="1.5"/>
            <line x1="41" y1="16" x2="44" y2="15" stroke="#475569" strokeWidth="1.5"/>
            <circle cx="27" cy="16" r="2.5" fill="#06b6d420"/>
            <circle cx="37" cy="16" r="2.5" fill="#06b6d420"/>
            <circle cx="28.5" cy="21" r="1.2" fill="#1e3a8a"/>
            <circle cx="35.5" cy="21" r="1.2" fill="#1e3a8a"/>
            {/* lab coat */}
            <rect x="20" y="28" width="24" height="22" rx="4" fill="#f1f5f9"/>
            <rect x="26" y="28" width="12" height="5" fill="#e2e8f0"/>
            <line x1="32" y1="33" x2="32" y2="50" stroke="#cbd5e1" strokeWidth="1"/>
            {/* flask */}
            <path d="M44 28 L48 28 L52 42 Q54 48 50 50 Q46 52 44 46 Z" fill="#06b6d440"/>
            <rect x="44" y="26" width="8" height="3" rx="1" fill="#94a3b8"/>
            <ellipse cx="48" cy="45" rx="4" ry="2" fill="#06b6d4" opacity="0.7"/>
            <circle cx="47" cy="40" r="1.5" fill="#06b6d4" opacity="0.9"/>
            {/* legs */}
            <rect x="22" y="50" width="8" height="12" rx="2" fill="#1e3a8a"/>
            <rect x="34" y="50" width="8" height="12" rx="2" fill="#1e3a8a"/>
        </svg>
    );
}

function ScientistT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* head */}
            <circle cx="32" cy="16" r="11" fill="#fde68a"/>
            <circle cx="28" cy="15" r="1.5" fill="#1e3a8a"/>
            <circle cx="36" cy="15" r="1.5" fill="#1e3a8a"/>
            <path d="M28 20 Q32 24 36 20" stroke="#1e3a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* glasses */}
            <circle cx="28" cy="15" r="3.5" fill="none" stroke="#94a3b8" strokeWidth="1.2"/>
            <circle cx="36" cy="15" r="3.5" fill="none" stroke="#94a3b8" strokeWidth="1.2"/>
            <line x1="31.5" y1="15" x2="32.5" y2="15" stroke="#94a3b8" strokeWidth="1"/>
            {/* lab coat professor style */}
            <rect x="18" y="27" width="28" height="24" rx="4" fill="#f8fafc"/>
            <rect x="26" y="27" width="12" height="6" fill="#e2e8f0"/>
            <line x1="32" y1="33" x2="32" y2="51" stroke="#cbd5e1" strokeWidth="1"/>
            {/* stethoscope */}
            <path d="M20 32 Q14 36 14 42 Q14 46 18 46 Q22 46 22 42" stroke="#475569" strokeWidth="1.5" fill="none"/>
            <circle cx="18" cy="47" r="2.5" fill="#475569"/>
            {/* clipboard */}
            <rect x="40" y="30" width="11" height="14" rx="1.5" fill="#fef3c7"/>
            <rect x="44" y="28" width="4" height="4" rx="1" fill="#d97706"/>
            <line x1="42" y1="36" x2="49" y2="36" stroke="#d97706" strokeWidth="0.8"/>
            <line x1="42" y1="38.5" x2="49" y2="38.5" stroke="#d97706" strokeWidth="0.8"/>
            <line x1="42" y1="41" x2="46" y2="41" stroke="#d97706" strokeWidth="0.8"/>
            {/* legs */}
            <rect x="20" y="51" width="9" height="11" rx="2" fill="#1e3a8a"/>
            <rect x="35" y="51" width="9" height="11" rx="2" fill="#1e3a8a"/>
        </svg>
    );
}

function ScientistT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* floating gears / atoms */}
            <circle cx="12" cy="20" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.2"/>
            <line x1="12" y1="14" x2="12" y2="26" stroke="#3b82f6" strokeWidth="1"/>
            <line x1="6" y1="20" x2="18" y2="20" stroke="#3b82f6" strokeWidth="1"/>
            <circle cx="52" cy="16" r="4" fill="none" stroke="#06b6d4" strokeWidth="1.2"/>
            <ellipse cx="52" cy="16" rx="7" ry="3" fill="none" stroke="#06b6d4" strokeWidth="0.8" transform="rotate(30 52 16)"/>
            <circle cx="52" cy="16" r="1.5" fill="#06b6d4"/>
            {/* head - goggles up */}
            <circle cx="32" cy="16" r="11" fill="#fde68a"/>
            <circle cx="28" cy="13" r="3.5" fill="#06b6d430" stroke="#06b6d4" strokeWidth="1"/>
            <circle cx="36" cy="13" r="3.5" fill="#06b6d430" stroke="#06b6d4" strokeWidth="1"/>
            <line x1="31.5" y1="10" x2="32.5" y2="10" stroke="#06b6d4" strokeWidth="1"/>
            <circle cx="28.5" cy="19" r="1.5" fill="#1e3a8a"/>
            <circle cx="35.5" cy="19" r="1.5" fill="#1e3a8a"/>
            <path d="M28 23 Q32 27 36 23" stroke="#1e3a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* complex coat with gadgets */}
            <rect x="18" y="27" width="28" height="24" rx="4" fill="#f1f5f9"/>
            <rect x="26" y="27" width="12" height="5" fill="#dbeafe"/>
            {/* glowing device */}
            <rect x="28" y="35" width="8" height="6" rx="1" fill="#1d4ed8"/>
            <circle cx="32" cy="38" r="2" fill="#60a5fa"/>
            {/* legs */}
            <rect x="20" y="51" width="9" height="11" rx="2" fill="#1e3a8a"/>
            <rect x="35" y="51" width="9" height="11" rx="2" fill="#1e3a8a"/>
        </svg>
    );
}

function ScientistT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* cosmic aura */}
            <circle cx="32" cy="28" r="26" fill="#3b82f615"/>
            {/* orbiting elements */}
            <ellipse cx="32" cy="28" rx="26" ry="12" fill="none" stroke="#3b82f640" strokeWidth="1" transform="rotate(-20 32 28)"/>
            <circle cx="10" cy="24" r="2.5" fill="#60a5fa"/>
            <circle cx="54" cy="32" r="2" fill="#06b6d4"/>
            <circle cx="32" cy="8" r="1.5" fill="#818cf8"/>
            {/* head with cosmic eyes */}
            <circle cx="32" cy="18" r="11" fill="#dde6ed"/>
            <circle cx="27.5" cy="16" r="3" fill="#3b82f6"/>
            <circle cx="36.5" cy="16" r="3" fill="#3b82f6"/>
            <circle cx="28" cy="15.5" r="1" fill="white"/>
            <circle cx="37" cy="15.5" r="1" fill="white"/>
            <path d="M27 22 Q32 26 37 22" stroke="#1e3a8a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* white robe */}
            <rect x="16" y="29" width="32" height="26" rx="6" fill="#e0f2fe"/>
            <line x1="32" y1="29" x2="32" y2="55" stroke="#93c5fd" strokeWidth="1"/>
            {/* equations floating */}
            <text x="6" y="12" fontSize="5" fill="#3b82f6" fontFamily="monospace">E=mc²</text>
            <text x="44" y="50" fontSize="4" fill="#06b6d4" fontFamily="monospace">∞</text>
            <text x="8" y="46" fontSize="5" fill="#818cf8" fontFamily="monospace">Φ</text>
            {/* legs */}
            <rect x="22" y="52" width="8" height="10" rx="2" fill="#bfdbfe"/>
            <rect x="34" y="52" width="8" height="10" rx="2" fill="#bfdbfe"/>
        </svg>
    );
}

// ─── Medieval ────────────────────────────────────────────────────────────────
function MedievalT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* peasant hat */}
            <path d="M18 18 Q22 10 32 10 Q42 10 46 18" stroke="#8B6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <ellipse cx="32" cy="18" rx="14" ry="3" fill="#8B6914"/>
            {/* head */}
            <circle cx="32" cy="22" r="10" fill="#fde68a"/>
            <circle cx="28.5" cy="21" r="1.5" fill="#5a3a1a"/>
            <circle cx="35.5" cy="21" r="1.5" fill="#5a3a1a"/>
            <path d="M28 26 Q32 29 36 26" stroke="#5a3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* peasant shirt */}
            <rect x="22" y="32" width="20" height="18" rx="3" fill="#d97706"/>
            <rect x="29" y="32" width="6" height="4" fill="#c4870a"/>
            {/* pitchfork */}
            <line x1="46" y1="20" x2="46" y2="56" stroke="#8B6914" strokeWidth="2" strokeLinecap="round"/>
            <line x1="43" y1="24" x2="43" y2="32" stroke="#8B6914" strokeWidth="1.5"/>
            <line x1="46" y1="24" x2="46" y2="32" stroke="#8B6914" strokeWidth="1.5"/>
            <line x1="49" y1="24" x2="49" y2="32" stroke="#8B6914" strokeWidth="1.5"/>
            {/* legs */}
            <rect x="24" y="50" width="7" height="12" rx="2" fill="#92400e"/>
            <rect x="33" y="50" width="7" height="12" rx="2" fill="#92400e"/>
        </svg>
    );
}

function MedievalT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* wide merchant hat */}
            <ellipse cx="32" cy="14" rx="16" ry="3.5" fill="#5c3317"/>
            <path d="M22 14 Q24 8 32 7 Q40 8 42 14" fill="#5c3317"/>
            <circle cx="38" cy="12" r="2" fill="#d4a017"/>
            {/* head */}
            <circle cx="32" cy="22" r="10" fill="#fde68a"/>
            <circle cx="28.5" cy="21" r="1.5" fill="#5a3a1a"/>
            <circle cx="35.5" cy="21" r="1.5" fill="#5a3a1a"/>
            <path d="M28 26 Q32 29 36 26" stroke="#5a3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* robe */}
            <rect x="20" y="32" width="24" height="22" rx="4" fill="#d97706"/>
            <rect x="28" y="32" width="8" height="5" fill="#c4870a"/>
            {/* coin bag */}
            <ellipse cx="44" cy="40" rx="7" ry="8" fill="#d4a017"/>
            <ellipse cx="44" cy="35" rx="4" ry="3" fill="#b8860b"/>
            <text x="40" y="43" fontSize="6" fill="#5c3317" fontFamily="sans-serif">$</text>
            {/* walking stick */}
            <line x1="14" y1="26" x2="16" y2="58" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M11 26 Q14 22 17 26" stroke="#8B6914" strokeWidth="2" fill="none"/>
            {/* legs */}
            <rect x="22" y="54" width="8" height="8" rx="2" fill="#92400e"/>
            <rect x="34" y="54" width="8" height="8" rx="2" fill="#92400e"/>
        </svg>
    );
}

function MedievalT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* plumed helmet */}
            <path d="M20 22 Q20 10 32 10 Q44 10 44 22 L44 28 L20 28 Z" fill="#808080"/>
            <rect x="27" y="22" width="10" height="5" rx="1" fill="#444"/>
            <path d="M28 10 Q32 4 36 10" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* shield */}
            <path d="M8 26 L16 24 L16 44 Q12 50 8 44 Z" fill="#c0392b"/>
            <path d="M8 26 L16 24 L16 44 Q12 50 8 44 Z" stroke="#7b0000" strokeWidth="1" fill="none"/>
            <line x1="8" y1="34" x2="16" y2="34" stroke="#7b0000" strokeWidth="1"/>
            <line x1="12" y1="26" x2="12" y2="44" stroke="#7b0000" strokeWidth="1"/>
            {/* armor body */}
            <rect x="20" y="28" width="24" height="22" rx="4" fill="#909090"/>
            <path d="M20 38 Q32 34 44 38" stroke="#666" strokeWidth="1" fill="none"/>
            {/* sword */}
            <rect x="46" y="18" width="2.5" height="26" rx="1" fill="#c0c0c0"/>
            <rect x="43" y="23" width="8" height="2.5" rx="1" fill="#d4a017"/>
            {/* legs */}
            <rect x="22" y="50" width="8" height="12" rx="2" fill="#666"/>
            <rect x="34" y="50" width="8" height="12" rx="2" fill="#666"/>
        </svg>
    );
}

function MedievalT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* crown */}
            <rect x="20" y="4" width="24" height="6" rx="2" fill="#d4a017"/>
            <polygon points="23,4 23,-1 27,4" fill="#d4a017"/>
            <polygon points="30,4 32,-1 34,4" fill="#d4a017"/>
            <polygon points="37,4 41,-1 41,4" fill="#d4a017"/>
            <circle cx="23" cy="2" r="1.5" fill="#e11d48"/>
            <circle cx="32" cy="0" r="1.5" fill="#3b82f6"/>
            <circle cx="41" cy="2" r="1.5" fill="#e11d48"/>
            {/* head */}
            <circle cx="32" cy="18" r="11" fill="#fde68a"/>
            <circle cx="28" cy="16" r="1.5" fill="#5a3a1a"/>
            <circle cx="36" cy="16" r="1.5" fill="#5a3a1a"/>
            <path d="M28 22 Q32 26 36 22" stroke="#5a3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* royal robe */}
            <rect x="16" y="29" width="32" height="26" rx="5" fill="#7e0a0a"/>
            {/* fur trim */}
            <rect x="16" y="29" width="32" height="4" rx="2" fill="white"/>
            <rect x="16" y="51" width="32" height="4" rx="2" fill="white"/>
            <line x1="32" y1="29" x2="32" y2="55" stroke="#5a0808" strokeWidth="1.5"/>
            {/* scepter */}
            <line x1="46" y1="16" x2="50" y2="56" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="46" cy="14" r="5" fill="#d4a017"/>
            <circle cx="46" cy="14" r="3" fill="#e11d48"/>
            {/* legs */}
            <rect x="22" y="53" width="8" height="9" rx="2" fill="#5a0808"/>
            <rect x="34" y="53" width="8" height="9" rx="2" fill="#5a0808"/>
        </svg>
    );
}

function MedievalT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* divine glow */}
            <circle cx="32" cy="30" r="28" fill="#d4a01710"/>
            {/* multiple crowns stacked */}
            <rect x="20" y="2" width="24" height="5" rx="2" fill="#d4a017"/>
            <polygon points="23,2 21,-2 27,2" fill="#d4a017"/>
            <polygon points="32,2 32,-2 33,2" fill="#d4a017"/>
            <polygon points="37,2 43,-2 41,2" fill="#d4a017"/>
            <circle cx="32" cy="0" r="2" fill="#ff0000"/>
            {/* head */}
            <circle cx="32" cy="16" r="11" fill="#fde68a"/>
            <circle cx="28" cy="14" r="1.8" fill="#5a3a1a"/>
            <circle cx="36" cy="14" r="1.8" fill="#5a3a1a"/>
            <path d="M27 20 Q32 24 37 20" stroke="#5a3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* imperial robe */}
            <rect x="14" y="27" width="36" height="28" rx="6" fill="#6b0000"/>
            {/* golden trim */}
            <rect x="14" y="27" width="36" height="5" rx="3" fill="#d4a017"/>
            <rect x="14" y="50" width="36" height="5" rx="3" fill="#d4a017"/>
            {/* orb of power */}
            <circle cx="14" cy="40" r="7" fill="#d4a017"/>
            <circle cx="14" cy="40" r="4.5" fill="#3b82f6" opacity="0.8"/>
            <circle cx="14" cy="40" r="2" fill="white" opacity="0.9"/>
            {/* divine scepter */}
            <line x1="50" y1="8" x2="50" y2="58" stroke="#d4a017" strokeWidth="3" strokeLinecap="round"/>
            <path d="M44 8 Q50 2 56 8 Q50 14 44 8 Z" fill="#d4a017"/>
            <circle cx="50" cy="8" r="3" fill="#ff4444"/>
            {/* legs */}
            <rect x="20" y="52" width="8" height="10" rx="2" fill="#5a0000"/>
            <rect x="36" y="52" width="8" height="10" rx="2" fill="#5a0000"/>
        </svg>
    );
}

// ─── Space ───────────────────────────────────────────────────────────────────
function SpaceT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* helmet */}
            <circle cx="32" cy="18" r="14" fill="#d1d5db"/>
            <circle cx="32" cy="18" r="10" fill="#bfdbfe" opacity="0.7"/>
            {/* visor */}
            <ellipse cx="32" cy="18" rx="7" ry="5" fill="#1d4ed8" opacity="0.8"/>
            {/* antenna */}
            <line x1="32" y1="4" x2="32" y2="10" stroke="#9ca3af" strokeWidth="2"/>
            <circle cx="32" cy="3" r="2" fill="#f59e0b"/>
            {/* spacesuit body */}
            <rect x="20" y="32" width="24" height="20" rx="6" fill="#e5e7eb"/>
            {/* chest control panel */}
            <rect x="26" y="36" width="12" height="8" rx="2" fill="#374151"/>
            <circle cx="29" cy="39.5" r="1.5" fill="#22d3ee"/>
            <circle cx="32" cy="39.5" r="1.5" fill="#22c55e"/>
            <circle cx="35" cy="39.5" r="1.5" fill="#f59e0b"/>
            {/* legs */}
            <rect x="22" y="52" width="8" height="10" rx="3" fill="#d1d5db"/>
            <rect x="34" y="52" width="8" height="10" rx="3" fill="#d1d5db"/>
            {/* boots */}
            <rect x="20" y="58" width="12" height="4" rx="2" fill="#9ca3af"/>
            <rect x="32" y="58" width="12" height="4" rx="2" fill="#9ca3af"/>
        </svg>
    );
}

function SpaceT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* stars background hints */}
            <circle cx="8" cy="8" r="1" fill="#e0e7ff"/>
            <circle cx="56" cy="12" r="1.2" fill="#e0e7ff"/>
            <circle cx="12" cy="50" r="0.8" fill="#e0e7ff"/>
            {/* large helmet */}
            <circle cx="32" cy="16" r="14" fill="#c7d2fe"/>
            <ellipse cx="32" cy="16" rx="10" ry="8" fill="#1e40af" opacity="0.7"/>
            <ellipse cx="32" cy="16" rx="5" ry="4" fill="#60a5fa" opacity="0.5"/>
            <circle cx="29" cy="13" r="1" fill="white" opacity="0.8"/>
            {/* suit */}
            <rect x="18" y="30" width="28" height="24" rx="7" fill="#c7d2fe"/>
            {/* backpack / life support */}
            <rect x="48" y="30" width="8" height="18" rx="3" fill="#a5b4fc"/>
            <line x1="48" y1="34" x2="46" y2="38" stroke="#6366f1" strokeWidth="1.5"/>
            <line x1="48" y1="44" x2="46" y2="46" stroke="#6366f1" strokeWidth="1.5"/>
            {/* chest display */}
            <rect x="26" y="36" width="12" height="7" rx="1.5" fill="#1e3a8a"/>
            <circle cx="29" cy="39" r="1.2" fill="#22d3ee"/>
            <circle cx="32" cy="39" r="1.2" fill="#f59e0b"/>
            <circle cx="35" cy="39" r="1.2" fill="#ef4444"/>
            {/* legs */}
            <rect x="20" y="54" width="9" height="8" rx="3" fill="#a5b4fc"/>
            <rect x="35" y="54" width="9" height="8" rx="3" fill="#a5b4fc"/>
        </svg>
    );
}

function SpaceT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* head - command helmet */}
            <circle cx="32" cy="16" r="13" fill="#7c3aed"/>
            <ellipse cx="32" cy="16" rx="9" ry="7" fill="#4c1d95" opacity="0.8"/>
            <ellipse cx="32" cy="16" rx="5" ry="3.5" fill="#8b5cf6" opacity="0.6"/>
            <circle cx="29" cy="13" r="1" fill="white" opacity="0.9"/>
            {/* uniform */}
            <rect x="18" y="29" width="28" height="24" rx="5" fill="#5b21b6"/>
            <line x1="32" y1="29" x2="32" y2="53" stroke="#7c3aed" strokeWidth="1"/>
            {/* rank badge */}
            <rect x="24" y="34" width="8" height="5" rx="1" fill="#d4a017"/>
            <line x1="25" y1="36" x2="31" y2="36" stroke="#92400e" strokeWidth="0.8"/>
            <line x1="25" y1="37.5" x2="31" y2="37.5" stroke="#92400e" strokeWidth="0.8"/>
            {/* star emblem */}
            <polygon points="36,33 37,36 40,36 37.5,38 38.5,41 36,39 33.5,41 34.5,38 32,36 35,36" fill="#d4a017"/>
            {/* laser gun */}
            <rect x="44" y="36" width="14" height="5" rx="2" fill="#7c3aed"/>
            <rect x="48" y="33" width="4" height="3" rx="1" fill="#5b21b6"/>
            <circle cx="57" cy="38.5" r="2" fill="#22d3ee"/>
            {/* legs */}
            <rect x="20" y="53" width="9" height="9" rx="2" fill="#4c1d95"/>
            <rect x="35" y="53" width="9" height="9" rx="2" fill="#4c1d95"/>
        </svg>
    );
}

function SpaceT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* nebula aura */}
            <circle cx="32" cy="30" r="27" fill="#7c3aed10"/>
            {/* energy wings */}
            <path d="M18 28 Q4 20 6 36 Q10 42 18 40 Z" fill="#7c3aed" opacity="0.6"/>
            <path d="M46 28 Q60 20 58 36 Q54 42 46 40 Z" fill="#7c3aed" opacity="0.6"/>
            {/* winged helmet */}
            <circle cx="32" cy="16" r="13" fill="#4c1d95"/>
            <ellipse cx="32" cy="16" rx="9" ry="7" fill="#7c3aed" opacity="0.6"/>
            <ellipse cx="32" cy="16" rx="5" ry="3" fill="#c4b5fd" opacity="0.5"/>
            <path d="M18 14 Q14 8 18 4 Q20 10 22 12 Z" fill="#7c3aed"/>
            <path d="M46 14 Q50 8 46 4 Q44 10 42 12 Z" fill="#7c3aed"/>
            {/* suit */}
            <rect x="16" y="29" width="32" height="24" rx="6" fill="#4c1d95"/>
            {/* energy sword */}
            <line x1="48" y1="12" x2="48" y2="48" stroke="#22d3ee" strokeWidth="2.5"/>
            <rect x="44" y="32" width="8" height="3" rx="1.5" fill="#7c3aed"/>
            <circle cx="48" cy="12" r="3" fill="#22d3ee"/>
            {/* chest star */}
            <polygon points="32,33 33.5,38 38.5,38 34.5,41 36,46 32,43 28,46 29.5,41 25.5,38 30.5,38" fill="#d4a017"/>
            {/* legs */}
            <rect x="20" y="53" width="9" height="9" rx="2" fill="#3b0764"/>
            <rect x="35" y="53" width="9" height="9" rx="2" fill="#3b0764"/>
        </svg>
    );
}

function SpaceT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* cosmic aura rings */}
            <circle cx="32" cy="28" r="28" fill="#4c1d9508" />
            <circle cx="32" cy="28" r="22" fill="none" stroke="#7c3aed20" strokeWidth="1"/>
            <circle cx="32" cy="28" r="16" fill="none" stroke="#22d3ee15" strokeWidth="1"/>
            {/* orbiting stars */}
            <circle cx="8" cy="28" r="2" fill="#22d3ee"/>
            <circle cx="56" cy="28" r="2" fill="#f59e0b"/>
            <circle cx="32" cy="4" r="1.5" fill="#c4b5fd"/>
            <circle cx="32" cy="52" r="1.5" fill="#c4b5fd"/>
            {/* cosmic head */}
            <circle cx="32" cy="16" r="13" fill="#2e1065"/>
            <circle cx="27.5" cy="14" r="3.5" fill="#7c3aed"/>
            <circle cx="36.5" cy="14" r="3.5" fill="#7c3aed"/>
            <circle cx="28" cy="13.5" r="1.2" fill="#22d3ee"/>
            <circle cx="37" cy="13.5" r="1.2" fill="#22d3ee"/>
            <path d="M27 20 Q32 24 37 20" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* cosmic robe */}
            <rect x="14" y="29" width="36" height="28" rx="7" fill="#1e1b4b"/>
            {/* galaxies on robe */}
            <circle cx="24" cy="40" r="4" fill="#7c3aed30"/>
            <circle cx="40" cy="38" r="3" fill="#22d3ee20"/>
            <circle cx="32" cy="46" r="5" fill="#4c1d9540"/>
            <circle cx="32" cy="46" r="2" fill="#7c3aed" opacity="0.8"/>
            {/* legs */}
            <rect x="20" y="54" width="8" height="9" rx="2" fill="#1e1b4b"/>
            <rect x="36" y="54" width="8" height="9" rx="2" fill="#1e1b4b"/>
        </svg>
    );
}

// ─── Girly / Kawaii ──────────────────────────────────────────────────────────
function GirlyT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* cute chick */}
            <ellipse cx="32" cy="36" rx="14" ry="12" fill="#fbbf24"/>
            {/* head */}
            <circle cx="32" cy="22" r="12" fill="#fcd34d"/>
            <circle cx="27.5" cy="20" r="2.5" fill="#1f2937"/>
            <circle cx="36.5" cy="20" r="2.5" fill="#1f2937"/>
            <circle cx="28" cy="19" r="0.8" fill="white"/>
            <circle cx="37" cy="19" r="0.8" fill="white"/>
            {/* beak */}
            <path d="M28 25 L32 28 L36 25" fill="#f59e0b"/>
            {/* blush */}
            <ellipse cx="23.5" cy="23" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
            <ellipse cx="40.5" cy="23" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
            {/* wings */}
            <ellipse cx="16" cy="38" rx="7" ry="5" fill="#fbbf24" transform="rotate(-20 16 38)"/>
            <ellipse cx="48" cy="38" rx="7" ry="5" fill="#fbbf24" transform="rotate(20 48 38)"/>
            {/* tiny feet */}
            <path d="M26 48 L22 54 M26 48 L26 54 M26 48 L30 54" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M38 48 L34 54 M38 48 L38 54 M38 48 L42 54" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
}

function GirlyT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* sparkles */}
            <text x="4" y="16" fontSize="8" fill="#f9a8d4">✦</text>
            <text x="50" y="12" fontSize="6" fill="#c084fc">✦</text>
            <text x="52" y="46" fontSize="5" fill="#f9a8d4">✦</text>
            {/* fairy wings */}
            <path d="M20 26 Q6 18 8 34 Q12 42 22 36 Z" fill="#f0abfc" opacity="0.7"/>
            <path d="M20 26 Q6 18 8 34 Q12 42 22 36 Z" fill="none" stroke="#d946ef" strokeWidth="0.8"/>
            <path d="M44 26 Q58 18 56 34 Q52 42 42 36 Z" fill="#f0abfc" opacity="0.7"/>
            <path d="M44 26 Q58 18 56 34 Q52 42 42 36 Z" fill="none" stroke="#d946ef" strokeWidth="0.8"/>
            {/* small lower wings */}
            <path d="M22 36 Q10 36 12 46 Q18 50 24 44 Z" fill="#f0abfc" opacity="0.5"/>
            <path d="M42 36 Q54 36 52 46 Q46 50 40 44 Z" fill="#f0abfc" opacity="0.5"/>
            {/* head */}
            <circle cx="32" cy="18" r="11" fill="#fde68a"/>
            <circle cx="28" cy="16" r="1.8" fill="#db2777"/>
            <circle cx="36" cy="16" r="1.8" fill="#db2777"/>
            <path d="M28 21 Q32 25 36 21" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* blush */}
            <ellipse cx="24" cy="19" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            <ellipse cx="40" cy="19" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            {/* fairy dress */}
            <path d="M20 29 Q32 25 44 29 L46 52 Q32 56 18 52 Z" fill="#f0abfc"/>
            <path d="M20 29 Q32 25 44 29 L44 34 Q32 30 20 34 Z" fill="#d946ef" opacity="0.5"/>
            {/* wand */}
            <line x1="48" y1="16" x2="54" y2="44" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
            <polygon points="48,16 44,12 52,10 52,18" fill="#fbbf24"/>
            <circle cx="48" cy="16" r="3" fill="none" stroke="#fbbf24" strokeWidth="1"/>
        </svg>
    );
}

function GirlyT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* rainbow arc */}
            <path d="M4 36 Q20 8 44 8 Q58 8 58 36" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.4"/>
            {/* horn */}
            <path d="M32 2 L28 14 L36 14 Z" fill="#d4a017"/>
            <path d="M32 2 L30 14" stroke="white" strokeWidth="0.8" opacity="0.6"/>
            <path d="M32 2 L34 14" stroke="white" strokeWidth="0.8" opacity="0.6"/>
            {/* mane */}
            <path d="M22 12 Q16 20 18 30" stroke="#f472b6" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M22 12 Q14 22 20 32" stroke="#a855f7" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* head */}
            <ellipse cx="34" cy="20" rx="13" ry="11" fill="#fff1f2"/>
            <circle cx="30" cy="18" r="2" fill="#db2777"/>
            <circle cx="38" cy="18" r="2" fill="#db2777"/>
            <path d="M29 23 Q33 27 37 23" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="26.5" cy="21" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
            <ellipse cx="41.5" cy="21" rx="4" ry="2" fill="#fca5a5" opacity="0.6"/>
            {/* body */}
            <ellipse cx="32" cy="44" rx="14" ry="12" fill="#fce7f3"/>
            {/* tail */}
            <path d="M46 40 Q56 36 56 48 Q52 54 46 50" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M46 40 Q58 40 56 52" stroke="#f472b6" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* legs */}
            <rect x="22" y="54" width="6" height="9" rx="3" fill="#fce7f3"/>
            <rect x="30" y="54" width="6" height="9" rx="3" fill="#fce7f3"/>
            <rect x="38" y="52" width="5" height="9" rx="2.5" fill="#fce7f3"/>
        </svg>
    );
}

function GirlyT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* magic sparkles */}
            <text x="2" y="14" fontSize="10" fill="#f9a8d4">✦</text>
            <text x="50" y="10" fontSize="8" fill="#c084fc">✦</text>
            <text x="48" y="52" fontSize="7" fill="#f9a8d4">✦</text>
            <text x="4" y="50" fontSize="6" fill="#fbbf24">✦</text>
            {/* large fairy wings */}
            <path d="M18 24 Q2 12 4 30 Q8 44 20 38 Z" fill="#f9a8d4" opacity="0.75"/>
            <path d="M18 24 Q2 12 4 30 Q8 44 20 38 Z" fill="none" stroke="#ec4899" strokeWidth="1"/>
            <path d="M46 24 Q62 12 60 30 Q56 44 44 38 Z" fill="#f9a8d4" opacity="0.75"/>
            <path d="M46 24 Q62 12 60 30 Q56 44 44 38 Z" fill="none" stroke="#ec4899" strokeWidth="1"/>
            {/* head */}
            <circle cx="32" cy="16" r="12" fill="#fde68a"/>
            <circle cx="27.5" cy="14" r="2" fill="#db2777"/>
            <circle cx="36.5" cy="14" r="2" fill="#db2777"/>
            <path d="M27 19 Q32 23 37 19" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* flower crown */}
            <circle cx="24" cy="7" r="3" fill="#f472b6"/>
            <circle cx="32" cy="5" r="3.5" fill="#fbbf24"/>
            <circle cx="40" cy="7" r="3" fill="#a855f7"/>
            <circle cx="32" cy="5" r="1.5" fill="#fde68a"/>
            {/* sparkle dress */}
            <path d="M18 28 Q32 24 46 28 L50 58 Q32 62 14 58 Z" fill="#f0abfc"/>
            <path d="M18 28 Q32 24 46 28 L46 36 Q32 32 18 36 Z" fill="#d946ef" opacity="0.6"/>
            {/* wand */}
            <line x1="50" y1="14" x2="58" y2="48" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="14" r="5" fill="#fbbf24"/>
            <polygon points="50,8 48,14 52,14" fill="#fbbf24"/>
            <circle cx="50" cy="14" r="2.5" fill="white" opacity="0.8"/>
        </svg>
    );
}

function GirlyT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* rainbow aura */}
            <circle cx="32" cy="30" r="28" fill="#f472b610"/>
            <path d="M4 30 Q20 4 44 4 Q60 4 60 30" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.3"/>
            <path d="M6 32 Q22 8 44 8 Q58 8 58 32" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.3"/>
            {/* grand rainbow wings */}
            <path d="M16 22 Q0 10 2 28 Q6 44 18 40 L20 32 Z" fill="#f9a8d4" opacity="0.8"/>
            <path d="M16 22 Q0 10 2 28 Q6 44 18 40 L20 32 Z" fill="none" stroke="#ec4899" strokeWidth="1.2"/>
            <path d="M48 22 Q64 10 62 28 Q58 44 46 40 L44 32 Z" fill="#f9a8d4" opacity="0.8"/>
            <path d="M48 22 Q64 10 62 28 Q58 44 46 40 L44 32 Z" fill="none" stroke="#ec4899" strokeWidth="1.2"/>
            <path d="M18 34 Q6 36 8 48 Q14 54 22 48 Z" fill="#c084fc" opacity="0.6"/>
            <path d="M46 34 Q58 36 56 48 Q50 54 42 48 Z" fill="#c084fc" opacity="0.6"/>
            {/* head */}
            <circle cx="32" cy="14" r="12" fill="#fde68a"/>
            <circle cx="28" cy="12" r="2" fill="#db2777"/>
            <circle cx="36" cy="12" r="2" fill="#db2777"/>
            <path d="M27 17 Q32 21 37 17" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="24.5" cy="15" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            <ellipse cx="39.5" cy="15" rx="4" ry="2" fill="#fca5a5" opacity="0.5"/>
            {/* grand flower crown */}
            <circle cx="22" cy="4" r="3.5" fill="#f472b6"/>
            <circle cx="32" cy="2" r="4" fill="#fbbf24"/>
            <circle cx="42" cy="4" r="3.5" fill="#a855f7"/>
            <circle cx="27" cy="3" r="2.5" fill="#22d3ee"/>
            <circle cx="37" cy="3" r="2.5" fill="#f472b6"/>
            <circle cx="32" cy="2" r="1.8" fill="white" opacity="0.9"/>
            {/* grand dress */}
            <path d="M16 26 Q32 22 48 26 L52 58 L32 62 L12 58 Z" fill="#f0abfc"/>
            <path d="M16 26 Q32 22 48 26 L48 34 Q32 30 16 34 Z" fill="#d946ef" opacity="0.6"/>
            {/* star pattern on dress */}
            <text x="26" y="46" fontSize="8" fill="#fbbf24">✦</text>
            <text x="36" y="50" fontSize="6" fill="#c084fc">✦</text>
        </svg>
    );
}

// ─── Animals ─────────────────────────────────────────────────────────────────
function AnimalsT1({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* tadpole body */}
            <ellipse cx="30" cy="34" rx="16" ry="12" fill="#6ee7b7"/>
            {/* head */}
            <circle cx="30" cy="24" r="12" fill="#34d399"/>
            <circle cx="25.5" cy="22" r="2.5" fill="#064e3b"/>
            <circle cx="34.5" cy="22" r="2.5" fill="#064e3b"/>
            <circle cx="26" cy="21.5" r="0.8" fill="white"/>
            <circle cx="35" cy="21.5" r="0.8" fill="white"/>
            <path d="M26 27 Q30 30.5 34 27" stroke="#064e3b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* spots */}
            <circle cx="24" cy="32" r="2.5" fill="#10b981" opacity="0.5"/>
            <circle cx="36" cy="34" r="2" fill="#10b981" opacity="0.5"/>
            {/* tail */}
            <path d="M46 34 Q56 30 58 40 Q56 48 48 44" stroke="#34d399" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {/* tiny legs */}
            <path d="M22 44 L18 52 L22 56" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M38 44 L42 52 L38 56" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function AnimalsT2({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* fox ears */}
            <path d="M18 14 L14 4 L26 12 Z" fill="#f97316"/>
            <path d="M19 14 L16 7 L24 12 Z" fill="#fde68a"/>
            <path d="M46 14 L50 4 L38 12 Z" fill="#f97316"/>
            <path d="M45 14 L48 7 L40 12 Z" fill="#fde68a"/>
            {/* head */}
            <circle cx="32" cy="20" r="13" fill="#f97316"/>
            <ellipse cx="32" cy="24" rx="8" ry="6" fill="#fde68a"/>
            {/* eyes */}
            <circle cx="26.5" cy="18" r="2.5" fill="#1f2937"/>
            <circle cx="37.5" cy="18" r="2.5" fill="#1f2937"/>
            <circle cx="27" cy="17.5" r="0.8" fill="white"/>
            <circle cx="38" cy="17.5" r="0.8" fill="white"/>
            {/* nose */}
            <ellipse cx="32" cy="24" rx="2" ry="1.2" fill="#1f2937"/>
            <path d="M30 25 L32 27 L34 25" stroke="#1f2937" strokeWidth="1" fill="none"/>
            {/* blush */}
            <ellipse cx="22" cy="22" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6"/>
            <ellipse cx="42" cy="22" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6"/>
            {/* body */}
            <ellipse cx="32" cy="44" rx="13" ry="11" fill="#f97316"/>
            <ellipse cx="32" cy="44" rx="8" ry="7" fill="#fde68a"/>
            {/* tail */}
            <path d="M44 40 Q56 32 58 46 Q56 56 46 52" stroke="#f97316" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M54 48 Q58 52 56 56" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* legs */}
            <rect x="24" y="53" width="7" height="9" rx="3.5" fill="#f97316"/>
            <rect x="33" y="53" width="7" height="9" rx="3.5" fill="#f97316"/>
        </svg>
    );
}

function AnimalsT3({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* moon */}
            <path d="M48 6 Q54 12 54 20 Q48 14 40 14 Q44 8 48 6 Z" fill="#fde68a" opacity="0.7"/>
            {/* wolf ears */}
            <path d="M18 12 L14 2 L26 10 Z" fill="#6b7280"/>
            <path d="M19 12 L16 5 L24 10 Z" fill="#d1d5db"/>
            <path d="M46 12 L50 2 L38 10 Z" fill="#6b7280"/>
            <path d="M45 12 L48 5 L40 10 Z" fill="#d1d5db"/>
            {/* head */}
            <circle cx="32" cy="18" r="13" fill="#6b7280"/>
            <ellipse cx="32" cy="22" rx="8" ry="6" fill="#d1d5db"/>
            {/* eyes - intense */}
            <circle cx="26.5" cy="16" r="2.5" fill="#f59e0b"/>
            <circle cx="37.5" cy="16" r="2.5" fill="#f59e0b"/>
            <circle cx="26.5" cy="16" r="1" fill="#1f2937"/>
            <circle cx="37.5" cy="16" r="1" fill="#1f2937"/>
            {/* snout */}
            <ellipse cx="32" cy="23" rx="4" ry="3" fill="#9ca3af"/>
            <ellipse cx="32" cy="22" rx="2" ry="1" fill="#1f2937"/>
            <path d="M30 24 L32 26 L34 24" stroke="#1f2937" strokeWidth="1" fill="none"/>
            {/* howling pose - head up */}
            <rect x="22" y="31" width="20" height="18" rx="4" fill="#374151"/>
            {/* front legs - raised */}
            <path d="M22 36 L16 28 L14 32" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M42 36 L48 28 L50 32" stroke="#374151" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {/* back legs */}
            <rect x="22" y="49" width="8" height="13" rx="4" fill="#374151"/>
            <rect x="34" y="49" width="8" height="13" rx="4" fill="#374151"/>
            {/* tail */}
            <path d="M42 48 Q54 44 54 56 Q50 60 44 56" stroke="#6b7280" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
    );
}

function AnimalsT4({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* ears */}
            <ellipse cx="18" cy="12" rx="6" ry="8" fill="#d97706" transform="rotate(-15 18 12)"/>
            <ellipse cx="18" cy="12" rx="3.5" ry="5" fill="#fde68a" transform="rotate(-15 18 12)"/>
            <ellipse cx="46" cy="12" rx="6" ry="8" fill="#d97706" transform="rotate(15 46 12)"/>
            <ellipse cx="46" cy="12" rx="3.5" ry="5" fill="#fde68a" transform="rotate(15 46 12)"/>
            {/* mane */}
            <circle cx="32" cy="22" r="18" fill="#92400e"/>
            <circle cx="32" cy="22" r="14" fill="#d97706"/>
            {/* head */}
            <circle cx="32" cy="22" r="11" fill="#fde68a"/>
            <circle cx="27.5" cy="20" r="2.5" fill="#1f2937"/>
            <circle cx="36.5" cy="20" r="2.5" fill="#1f2937"/>
            <circle cx="28" cy="19" r="0.8" fill="white"/>
            <circle cx="37" cy="19" r="0.8" fill="white"/>
            {/* nose */}
            <ellipse cx="32" cy="25" rx="3" ry="2" fill="#92400e"/>
            {/* mouth/whiskers */}
            <path d="M30 26 L32 28 L34 26" stroke="#92400e" strokeWidth="1.2" fill="none"/>
            <line x1="18" y1="25" x2="26" y2="24" stroke="#92400e" strokeWidth="0.8"/>
            <line x1="18" y1="27" x2="26" y2="26" stroke="#92400e" strokeWidth="0.8"/>
            <line x1="38" y1="24" x2="46" y2="25" stroke="#92400e" strokeWidth="0.8"/>
            <line x1="38" y1="26" x2="46" y2="27" stroke="#92400e" strokeWidth="0.8"/>
            {/* body */}
            <ellipse cx="32" cy="48" rx="14" ry="12" fill="#d97706"/>
            {/* paws */}
            <ellipse cx="20" cy="52" rx="7" ry="5" fill="#d97706"/>
            <ellipse cx="44" cy="52" rx="7" ry="5" fill="#d97706"/>
            <ellipse cx="26" cy="58" rx="5" ry="4" fill="#b45309"/>
            <ellipse cx="38" cy="58" rx="5" ry="4" fill="#b45309"/>
            {/* tail tip */}
            <path d="M44 44 Q56 40 56 50 Q52 58 46 54" stroke="#d97706" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <circle cx="54" cy="52" r="4" fill="#92400e"/>
        </svg>
    );
}

function AnimalsT5({ s }: { s: number }) {
    return (
        <svg viewBox="0 0 64 64" width={s} height={s} aria-hidden>
            {/* ethereal aura */}
            <circle cx="32" cy="30" r="28" fill="#f59e0b08"/>
            {/* spirit energy lines */}
            <path d="M8 20 Q20 16 32 20 Q44 16 56 20" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity="0.4"/>
            <path d="M6 36 Q20 30 32 36 Q44 30 58 36" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.3"/>
            {/* wolf spirit ears */}
            <path d="M14 16 L10 4 L22 14 Z" fill="#f59e0b" opacity="0.8"/>
            <path d="M50 16 L54 4 L42 14 Z" fill="#f59e0b" opacity="0.8"/>
            {/* ethereal head */}
            <circle cx="32" cy="18" r="13" fill="#fde68a" opacity="0.9"/>
            {/* cosmic eyes */}
            <circle cx="27" cy="16" r="3.5" fill="#0ea5e9"/>
            <circle cx="37" cy="16" r="3.5" fill="#0ea5e9"/>
            <circle cx="27" cy="16" r="1.5" fill="white"/>
            <circle cx="37" cy="16" r="1.5" fill="white"/>
            <circle cx="27.5" cy="15.5" r="0.6" fill="#0ea5e9"/>
            <circle cx="37.5" cy="15.5" r="0.6" fill="#0ea5e9"/>
            {/* nose + mouth */}
            <ellipse cx="32" cy="22" rx="2.5" ry="1.5" fill="#d97706"/>
            <path d="M29.5 23 L32 25 L34.5 23" stroke="#d97706" strokeWidth="1" fill="none"/>
            {/* ethereal body (semi-transparent) */}
            <ellipse cx="32" cy="44" rx="16" ry="14" fill="#fde68a" opacity="0.5"/>
            <ellipse cx="32" cy="44" rx="10" ry="9" fill="#fbbf24" opacity="0.4"/>
            {/* spirit particles */}
            <circle cx="16" cy="36" r="2" fill="#f59e0b" opacity="0.7"/>
            <circle cx="48" cy="38" r="1.5" fill="#22d3ee" opacity="0.8"/>
            <circle cx="22" cy="52" r="1.5" fill="#f59e0b" opacity="0.6"/>
            <circle cx="42" cy="50" r="2" fill="#22d3ee" opacity="0.7"/>
            <circle cx="32" cy="56" r="1" fill="#fbbf24" opacity="0.8"/>
            {/* tail spirit energy */}
            <path d="M46 40 Q60 34 60 46 Q58 56 50 54 Q44 52 44 46" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
        </svg>
    );
}

// ─── Dispatch ────────────────────────────────────────────────────────────────
type Tier = 1 | 2 | 3 | 4 | 5;

const THEME_COMPONENTS: Record<string, Record<Tier, React.FC<{ s: number }>>> = {
    warrior:   { 1: WarriorT1,   2: WarriorT2,   3: WarriorT3,   4: WarriorT4,   5: WarriorT5   },
    scientist: { 1: ScientistT1, 2: ScientistT2, 3: ScientistT3, 4: ScientistT4, 5: ScientistT5 },
    medieval:  { 1: MedievalT1,  2: MedievalT2,  3: MedievalT3,  4: MedievalT4,  5: MedievalT5  },
    space:     { 1: SpaceT1,     2: SpaceT2,     3: SpaceT3,     4: SpaceT4,     5: SpaceT5     },
    girly:     { 1: GirlyT1,     2: GirlyT2,     3: GirlyT3,     4: GirlyT4,     5: GirlyT5     },
    animals:   { 1: AnimalsT1,   2: AnimalsT2,   3: AnimalsT3,   4: AnimalsT4,   5: AnimalsT5   },
};

export default function Avatar({ level, size = 48 }: Props) {
    const { theme } = useTheme();

    if (theme.id === 'plant') {
        return <PlantAvatar level={level} size={size} />;
    }

    const tier = Math.min(5, Math.ceil(level / 4)) as Tier;
    const TierComponent = THEME_COMPONENTS[theme.id]?.[tier] ?? WarriorT1;
    return <TierComponent s={size} />;
}
