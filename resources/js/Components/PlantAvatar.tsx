// ─── PlantAvatar ────────────────────────────────────────────────────────────
// 20 humanized plant SVG avatars, one per level.
// All share a 64×64 viewBox and render at arbitrary `size`.

interface Props {
    level: number;    // 1–20
    size?: number;
    className?: string;
}

export default function PlantAvatar({ level, size = 40, className = '' }: Props) {
    const l = Math.max(1, Math.min(20, Math.round(level)));
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            className={className}
            aria-hidden="true"
            fill="none"
        >
            {renderPlant(l)}
        </svg>
    );
}

// ─── Per-level SVG content ──────────────────────────────────────────────────

function renderPlant(level: number): JSX.Element {
    switch (level) {

        // ── L1 · Graine / Seed ───────────────────────────────────────────────
        case 1: return (
            <>
                <ellipse cx="32" cy="55" rx="20" ry="4" fill="#78350f"/>
                <ellipse cx="32" cy="40" rx="13" ry="10" fill="#b45309"/>
                <ellipse cx="28" cy="37" rx="5" ry="3.5" fill="#d97706" opacity="0.4"/>
                <path d="M25 42 Q32 45.5 39 42" stroke="#78350f" strokeWidth="1.5" fill="none"/>
                {/* sleeping eyes */}
                <path d="M26 37 Q28.5 35 31 37" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M33 37 Q35.5 35 38 37" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* tiny sprout stems */}
                <path d="M27 31 Q24 22 21 18" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M37 31 Q40 22 43 18" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <ellipse cx="19.5" cy="16.5" rx="4" ry="2.5" fill="#4ade80" transform="rotate(-40 19.5 16.5)"/>
                <ellipse cx="44.5" cy="16.5" rx="4" ry="2.5" fill="#4ade80" transform="rotate(40 44.5 16.5)"/>
            </>
        );

        // ── L2 · Germe / Sprout ───────────────────────────────────────────────
        case 2: return (
            <>
                <ellipse cx="32" cy="55" rx="18" ry="4" fill="#78350f"/>
                <path d="M32 54 Q30 44 32 36 Q34 30 31 24" stroke="#65a30d" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <circle cx="31" cy="20" r="11" fill="#86efac"/>
                <circle cx="27" cy="19" r="2" fill="#14532d"/>
                <circle cx="35" cy="19" r="2" fill="#14532d"/>
                <path d="M27 24 Q31 28 35 24" stroke="#14532d" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* leaf wings */}
                <ellipse cx="18" cy="37" rx="7" ry="3.5" fill="#65a30d" transform="rotate(-20 18 37)"/>
                <ellipse cx="46" cy="37" rx="7" ry="3.5" fill="#65a30d" transform="rotate(20 46 37)"/>
            </>
        );

        // ── L3 · Plantule / Seedling ──────────────────────────────────────────
        case 3: return (
            <>
                <path d="M21 51 L23 61 L41 61 L43 51 Z" fill="#c2410c"/>
                <rect x="19" y="48" width="26" height="5" rx="2" fill="#ea580c"/>
                <ellipse cx="32" cy="51" rx="11" ry="2.5" fill="#78350f"/>
                <line x1="32" y1="50" x2="32" y2="30" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="21" cy="41" rx="8.5" ry="3.5" fill="#4ade80" transform="rotate(-28 21 41)"/>
                <ellipse cx="43" cy="41" rx="8.5" ry="3.5" fill="#4ade80" transform="rotate(28 43 41)"/>
                <circle cx="32" cy="21" r="11" fill="#86efac"/>
                <circle cx="27.5" cy="20" r="2" fill="#15803d"/>
                <circle cx="36.5" cy="20" r="2" fill="#15803d"/>
                <path d="M26 25 Q32 30 38 25" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="24" cy="23" r="2.5" fill="#fda4af" opacity="0.5"/>
                <circle cx="40" cy="23" r="2.5" fill="#fda4af" opacity="0.5"/>
            </>
        );

        // ── L4 · Bourgeon / Bud ───────────────────────────────────────────────
        case 4: return (
            <>
                <path d="M20 51 L22 61 L42 61 L44 51 Z" fill="#c2410c"/>
                <rect x="18" y="48" width="28" height="5" rx="2" fill="#ea580c"/>
                <ellipse cx="32" cy="51" rx="12" ry="2.5" fill="#78350f"/>
                <line x1="32" y1="51" x2="32" y2="25" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="19.5" cy="40" rx="8" ry="3.5" fill="#34d399" transform="rotate(-30 19.5 40)"/>
                <ellipse cx="44.5" cy="40" rx="8" ry="3.5" fill="#34d399" transform="rotate(30 44.5 40)"/>
                {/* tulip bud head */}
                <ellipse cx="32" cy="17" rx="9" ry="11" fill="#fbcfe8"/>
                <path d="M26 17 Q32 8 38 17" fill="#f9a8d4" stroke="#f472b6" strokeWidth="1"/>
                {/* curious face */}
                <circle cx="28" cy="22" r="1.8" fill="#0d9488"/>
                <circle cx="36" cy="22" r="1.8" fill="#0d9488"/>
                <path d="M28.5 26 Q32 28.5 35.5 26" stroke="#0d9488" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L5 · Petite tige / Little Stem ────────────────────────────────────
        case 5: return (
            <>
                <ellipse cx="32" cy="56" rx="16" ry="4" fill="#78350f"/>
                <line x1="32" y1="55" x2="32" y2="24" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="18" cy="44" rx="9" ry="4" fill="#4ade80" transform="rotate(-25 18 44)"/>
                <ellipse cx="46" cy="44" rx="9" ry="4" fill="#4ade80" transform="rotate(25 46 44)"/>
                <ellipse cx="20" cy="35" rx="7.5" ry="3.5" fill="#86efac" transform="rotate(-15 20 35)"/>
                <ellipse cx="44" cy="35" rx="7.5" ry="3.5" fill="#86efac" transform="rotate(15 44 35)"/>
                {/* flower head */}
                <circle cx="32" cy="9" r="4" fill="#fde68a"/>
                <circle cx="39" cy="13" r="4" fill="#fde68a"/>
                <circle cx="39" cy="20" r="4" fill="#fde68a"/>
                <circle cx="32" cy="24" r="4" fill="#fde68a"/>
                <circle cx="25" cy="20" r="4" fill="#fde68a"/>
                <circle cx="25" cy="13" r="4" fill="#fde68a"/>
                <circle cx="32" cy="16" r="7" fill="#fbbf24"/>
                <circle cx="29.5" cy="15" r="1.5" fill="#166534"/>
                <circle cx="34.5" cy="15" r="1.5" fill="#166534"/>
                <path d="M29 19 Q32 22 35 19" stroke="#166534" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L6 · Feuillage / Leafling ─────────────────────────────────────────
        case 6: return (
            <>
                <ellipse cx="32" cy="57" rx="18" ry="4" fill="#78350f"/>
                <rect x="29" y="43" width="6" height="14" rx="3" fill="#78350f"/>
                {/* outer bush */}
                <circle cx="32" cy="30" r="18" fill="#15803d"/>
                {/* leaf bumps on edge */}
                <circle cx="14" cy="24" r="7" fill="#15803d"/>
                <circle cx="50" cy="24" r="7" fill="#15803d"/>
                <circle cx="18" cy="14" r="7" fill="#166534"/>
                <circle cx="46" cy="14" r="7" fill="#166534"/>
                <circle cx="32" cy="11" r="7" fill="#15803d"/>
                {/* inner lighter face area */}
                <circle cx="32" cy="31" r="13" fill="#22c55e"/>
                {/* leaf arms */}
                <ellipse cx="9" cy="35" rx="9" ry="4.5" fill="#16a34a" transform="rotate(-15 9 35)"/>
                <ellipse cx="55" cy="35" rx="9" ry="4.5" fill="#16a34a" transform="rotate(15 55 35)"/>
                <circle cx="27.5" cy="29" r="2.2" fill="#14532d"/>
                <circle cx="36.5" cy="29" r="2.2" fill="#14532d"/>
                <path d="M26 34 Q32 39 38 34" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L7 · Arbuste / Shrub ──────────────────────────────────────────────
        case 7: return (
            <>
                <ellipse cx="32" cy="57" rx="20" ry="4" fill="#78350f"/>
                <rect x="28" y="44" width="8" height="14" rx="4" fill="#78350f"/>
                {/* main body */}
                <ellipse cx="32" cy="31" rx="21" ry="19" fill="#059669"/>
                {/* leaf-arm branches raised */}
                <ellipse cx="8" cy="24" rx="9" ry="4.5" fill="#059669" transform="rotate(-45 8 24)"/>
                <ellipse cx="56" cy="24" rx="9" ry="4.5" fill="#059669" transform="rotate(45 56 24)"/>
                {/* face interior */}
                <ellipse cx="32" cy="33" rx="13" ry="11" fill="#34d399"/>
                <circle cx="27.5" cy="31" r="2.2" fill="#064e3b"/>
                <circle cx="36.5" cy="31" r="2.2" fill="#064e3b"/>
                <path d="M26 37 Q32 41 38 37" stroke="#064e3b" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L8 · Floraison / Blossom ──────────────────────────────────────────
        case 8: return (
            <>
                <ellipse cx="32" cy="57" rx="20" ry="4" fill="#78350f"/>
                <rect x="28" y="44" width="8" height="14" rx="4" fill="#78350f"/>
                <ellipse cx="32" cy="31" rx="21" ry="19" fill="#10b981"/>
                {/* flowers on shrub */}
                <circle cx="17" cy="21" r="6" fill="#f472b6"/>
                <circle cx="17" cy="21" r="3.5" fill="#fce7f3"/>
                <circle cx="32" cy="13" r="6" fill="#f472b6"/>
                <circle cx="32" cy="13" r="3.5" fill="#fce7f3"/>
                <circle cx="47" cy="21" r="6" fill="#f472b6"/>
                <circle cx="47" cy="21" r="3.5" fill="#fce7f3"/>
                {/* arms */}
                <ellipse cx="8" cy="25" rx="8" ry="4" fill="#10b981" transform="rotate(-45 8 25)"/>
                <ellipse cx="56" cy="25" rx="8" ry="4" fill="#10b981" transform="rotate(45 56 25)"/>
                {/* face area */}
                <ellipse cx="32" cy="33" rx="13" ry="11" fill="#6ee7b7"/>
                <circle cx="27.5" cy="31" r="2.2" fill="#065f46"/>
                <circle cx="36.5" cy="31" r="2.2" fill="#065f46"/>
                <path d="M25 36 Q32 42 39 36" stroke="#065f46" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="23" cy="34" r="2.5" fill="#fda4af" opacity="0.5"/>
                <circle cx="41" cy="34" r="2.5" fill="#fda4af" opacity="0.5"/>
            </>
        );

        // ── L9 · Jeune arbre / Sapling ────────────────────────────────────────
        case 9: return (
            <>
                <ellipse cx="32" cy="59" rx="20" ry="4" fill="#78350f"/>
                <rect x="27" y="36" width="10" height="24" rx="5" fill="#92400e"/>
                {/* cloud canopy */}
                <circle cx="32" cy="23" r="18" fill="#059669"/>
                <circle cx="14" cy="24" r="8" fill="#059669"/>
                <circle cx="50" cy="24" r="8" fill="#059669"/>
                <circle cx="20" cy="13" r="8" fill="#047857"/>
                <circle cx="44" cy="13" r="8" fill="#047857"/>
                <circle cx="32" cy="26" r="12" fill="#34d399"/>
                {/* wise face */}
                <ellipse cx="27" cy="24" rx="2.5" ry="2" fill="#064e3b"/>
                <ellipse cx="37" cy="24" rx="2.5" ry="2" fill="#064e3b"/>
                <path d="M28 29 Q32 32 36 29" stroke="#064e3b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L10 · Plante épanouie / Full Bloom ────────────────────────────────
        case 10: return (
            <>
                <ellipse cx="32" cy="59" rx="22" ry="4" fill="#78350f"/>
                <rect x="26" y="36" width="12" height="24" rx="6" fill="#78350f"/>
                <circle cx="32" cy="23" r="21" fill="#16a34a"/>
                {/* flowers */}
                <circle cx="15" cy="22" r="5" fill="#fb7185"/>
                <circle cx="15" cy="22" r="2.5" fill="#ffe4e6"/>
                <circle cx="49" cy="22" r="5" fill="#fb7185"/>
                <circle cx="49" cy="22" r="2.5" fill="#ffe4e6"/>
                <circle cx="32" cy="7" r="5" fill="#fb7185"/>
                <circle cx="32" cy="7" r="2.5" fill="#ffe4e6"/>
                <circle cx="21" cy="13" r="4" fill="#fda4af"/>
                <circle cx="21" cy="13" r="2" fill="#ffe4e6"/>
                <circle cx="43" cy="13" r="4" fill="#fda4af"/>
                <circle cx="43" cy="13" r="2" fill="#ffe4e6"/>
                <circle cx="32" cy="26" r="11" fill="#4ade80"/>
                <circle cx="28" cy="25" r="2" fill="#14532d"/>
                <circle cx="36" cy="25" r="2" fill="#14532d"/>
                <path d="M26 30 Q32 35 38 30" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L11 · Plante tropicale / Tropical Plant ────────────────────────────
        case 11: return (
            <>
                <ellipse cx="32" cy="59" rx="18" ry="4" fill="#78350f"/>
                <path d="M32 58 Q31 48 32 38 Q33 30 32 22" stroke="#0d9488" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                {/* large tropical leaves */}
                <path d="M32 40 Q14 32 8 18 Q16 22 20 36 Q25 38 32 40Z" fill="#14b8a6"/>
                <path d="M32 40 Q14 32 8 18" stroke="#0d9488" strokeWidth="1" fill="none"/>
                <path d="M32 40 Q50 32 56 18 Q48 22 44 36 Q39 38 32 40Z" fill="#14b8a6"/>
                <path d="M32 40 Q50 32 56 18" stroke="#0d9488" strokeWidth="1" fill="none"/>
                <path d="M32 28 Q22 16 20 8 Q28 14 30 24 Q31 26 32 28Z" fill="#2dd4bf"/>
                <path d="M32 28 Q42 16 44 8 Q36 14 34 24 Q33 26 32 28Z" fill="#2dd4bf"/>
                <circle cx="32" cy="16" r="10" fill="#5eead4"/>
                <ellipse cx="28" cy="15" rx="2.5" ry="2" fill="#134e4a"/>
                <ellipse cx="36" cy="15" rx="2.5" ry="2" fill="#134e4a"/>
                <path d="M28 19.5 Q32 23 36 19.5" stroke="#134e4a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L12 · Fougère ancestrale / Ancient Fern ────────────────────────────
        case 12: return (
            <>
                <ellipse cx="32" cy="59" rx="18" ry="4" fill="#78350f"/>
                <path d="M32 58 Q31 50 32 40" stroke="#166534" strokeWidth="3" fill="none" strokeLinecap="round"/>
                {/* drooping fronds */}
                <path d="M32 40 Q20 38 10 48" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M32 40 Q44 38 54 48" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M32 36 Q18 30 8 36" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M32 36 Q46 30 56 36" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M32 30 Q20 22 14 26" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M32 30 Q44 22 50 26" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                {/* frond tips */}
                <ellipse cx="10.5" cy="47.5" rx="4" ry="2" fill="#16a34a" transform="rotate(-30 10.5 47.5)"/>
                <ellipse cx="53.5" cy="47.5" rx="4" ry="2" fill="#16a34a" transform="rotate(30 53.5 47.5)"/>
                <ellipse cx="8.5" cy="36" rx="4" ry="2" fill="#15803d" transform="rotate(-10 8.5 36)"/>
                <ellipse cx="55.5" cy="36" rx="4" ry="2" fill="#15803d" transform="rotate(10 55.5 36)"/>
                <circle cx="32" cy="22" r="11" fill="#4ade80"/>
                <circle cx="28" cy="21" r="2" fill="#166534"/>
                <circle cx="36" cy="21" r="2" fill="#166534"/>
                <path d="M28 26 Q32 29 36 26" stroke="#166534" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* eyelashes for grace */}
                <path d="M26 19 L26.5 21" stroke="#166534" strokeWidth="1" strokeLinecap="round"/>
                <path d="M24.5 20 L25.5 22" stroke="#166534" strokeWidth="1" strokeLinecap="round"/>
                <path d="M38 19 L37.5 21" stroke="#166534" strokeWidth="1" strokeLinecap="round"/>
                <path d="M39.5 20 L38.5 22" stroke="#166534" strokeWidth="1" strokeLinecap="round"/>
            </>
        );

        // ── L13 · Bambou serein / Serene Bamboo ────────────────────────────────
        case 13: return (
            <>
                <ellipse cx="32" cy="59" rx="18" ry="4" fill="#78350f"/>
                {/* bamboo stalk */}
                <rect x="26" y="10" width="12" height="50" rx="6" fill="#84cc16"/>
                <rect x="28" y="10" width="4" height="50" rx="2" fill="#a3e635" opacity="0.35"/>
                {/* nodes */}
                <rect x="24" y="31" width="16" height="4" rx="2" fill="#65a30d"/>
                <rect x="24" y="48" width="16" height="4" rx="2" fill="#65a30d"/>
                {/* leaves at top */}
                <path d="M38 14 Q48 8 50 17" stroke="#4d7c0f" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M26 10 Q16 4 14 13" stroke="#4d7c0f" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M38 20 Q50 16 52 24" stroke="#65a30d" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* serene face — closed eyes */}
                <path d="M27.5 22 Q29.5 20 31.5 22" stroke="#3f6212" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M32.5 22 Q34.5 20 36.5 22" stroke="#3f6212" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M28.5 26.5 Q32 29.5 35.5 26.5" stroke="#3f6212" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L14 · Bonsaï zen / Zen Bonsai ─────────────────────────────────────
        case 14: return (
            <>
                {/* decorative pot */}
                <path d="M18 54 L20 63 L44 63 L46 54 Z" fill="#7c3aed" opacity="0.7"/>
                <rect x="16" y="51" width="32" height="5" rx="2" fill="#8b5cf6" opacity="0.7"/>
                <ellipse cx="32" cy="54" rx="14" ry="2.5" fill="#78350f"/>
                {/* gnarled trunk */}
                <path d="M30 53 Q26 43 28 33 Q30 25 26 17" stroke="#92400e" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M34 53 Q38 43 36 33 Q34 25 38 17" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                {/* asymmetric cloud canopy */}
                <circle cx="24" cy="15" r="11" fill="#047857"/>
                <circle cx="36" cy="13" r="10" fill="#065f46"/>
                <circle cx="44" cy="18" r="9" fill="#047857"/>
                <circle cx="16" cy="21" r="8" fill="#065f46"/>
                {/* zen face */}
                <path d="M25 16.5 Q27 14.5 29 16.5" stroke="#a7f3d0" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                <path d="M31 16.5 Q33 14.5 35 16.5" stroke="#a7f3d0" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                <path d="M25.5 20 Q29 22 32 20" stroke="#a7f3d0" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L15 · Cactus sage / Desert Sage ────────────────────────────────────
        case 15: return (
            <>
                <ellipse cx="32" cy="59" rx="18" ry="4" fill="#78350f"/>
                {/* main cactus body */}
                <rect x="24" y="15" width="16" height="45" rx="8" fill="#4d7c0f"/>
                <rect x="27" y="15" width="5" height="45" rx="2.5" fill="#65a30d" opacity="0.4"/>
                {/* left arm */}
                <path d="M24 36 Q12 36 12 26 Q12 21 17 21" stroke="#4d7c0f" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M24 36 Q12 36 12 26 Q12 21 17 21" stroke="#65a30d" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4"/>
                {/* right arm */}
                <path d="M40 32 Q52 32 52 22 Q52 17 47 17" stroke="#4d7c0f" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M40 32 Q52 32 52 22 Q52 17 47 17" stroke="#65a30d" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4"/>
                {/* spines */}
                <line x1="22" y1="27" x2="19" y2="25" stroke="#a3e635" strokeWidth="1" strokeLinecap="round"/>
                <line x1="22" y1="34" x2="19" y2="32" stroke="#a3e635" strokeWidth="1" strokeLinecap="round"/>
                <line x1="22" y1="42" x2="19" y2="40" stroke="#a3e635" strokeWidth="1" strokeLinecap="round"/>
                <line x1="42" y1="27" x2="45" y2="25" stroke="#a3e635" strokeWidth="1" strokeLinecap="round"/>
                <line x1="42" y1="34" x2="45" y2="32" stroke="#a3e635" strokeWidth="1" strokeLinecap="round"/>
                {/* wise face */}
                <ellipse cx="27.5" cy="25" rx="2.5" ry="2.2" fill="#86efac"/>
                <ellipse cx="36.5" cy="25" rx="2.5" ry="2.2" fill="#86efac"/>
                <path d="M27.5 24 Q27.5 22 28.5" stroke="#4d7c0f" strokeWidth="1" fill="none"/>
                <path d="M36.5 24 Q36.5 22 35.5" stroke="#4d7c0f" strokeWidth="1" fill="none"/>
                <path d="M27 30 Q32 33 37 30" stroke="#86efac" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L16 · Arbre sacré / Sacred Tree ────────────────────────────────────
        case 16: return (
            <>
                <ellipse cx="32" cy="59" rx="24" ry="4" fill="#78350f"/>
                <rect x="24" y="36" width="16" height="24" rx="8" fill="#92400e"/>
                {/* massive canopy */}
                <circle cx="32" cy="22" r="22" fill="#15803d"/>
                <circle cx="13" cy="28" r="10" fill="#166534"/>
                <circle cx="51" cy="28" r="10" fill="#166534"/>
                <circle cx="19" cy="11" r="9" fill="#14532d"/>
                <circle cx="45" cy="11" r="9" fill="#14532d"/>
                <circle cx="32" cy="22" r="14" fill="#16a34a"/>
                {/* golden sparkles */}
                <circle cx="20" cy="19" r="2.5" fill="#fbbf24"/>
                <circle cx="44" cy="19" r="2.5" fill="#fbbf24"/>
                <circle cx="32" cy="7" r="2.5" fill="#f59e0b"/>
                <circle cx="14" cy="29" r="1.8" fill="#fde68a"/>
                <circle cx="50" cy="29" r="1.8" fill="#fde68a"/>
                {/* ancient face */}
                <ellipse cx="27.5" cy="22" rx="2.5" ry="2.2" fill="#d1fae5"/>
                <ellipse cx="36.5" cy="22" rx="2.5" ry="2.2" fill="#d1fae5"/>
                <path d="M27.5 21 Q28 19 28.5" stroke="#14532d" strokeWidth="1.2" fill="none"/>
                <path d="M36.5 21 Q36 19 35.5" stroke="#14532d" strokeWidth="1.2" fill="none"/>
                <path d="M27 27 Q32 31 37 27" stroke="#d1fae5" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                {/* golden crown */}
                <path d="M26 9 L28 13 L32 10 L36 13 L38 9" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
            </>
        );

        // ── L17 · Forêt enchantée / Enchanted Forest ───────────────────────────
        case 17: return (
            <>
                <ellipse cx="32" cy="59" rx="22" ry="4" fill="#4c1d95"/>
                <rect x="25" y="36" width="14" height="24" rx="7" fill="#5b21b6"/>
                {/* magical violet canopy */}
                <circle cx="32" cy="21" r="21" fill="#6d28d9"/>
                <circle cx="13" cy="26" r="9" fill="#7c3aed"/>
                <circle cx="51" cy="26" r="9" fill="#7c3aed"/>
                <circle cx="19" cy="11" r="8" fill="#8b5cf6"/>
                <circle cx="45" cy="11" r="8" fill="#8b5cf6"/>
                <circle cx="32" cy="21" r="13" fill="#7c3aed"/>
                <circle cx="32" cy="21" r="8" fill="#a78bfa" opacity="0.7"/>
                {/* sparkle stars */}
                <circle cx="17" cy="16" r="2" fill="#ddd6fe"/>
                <circle cx="47" cy="16" r="2" fill="#ddd6fe"/>
                <circle cx="32" cy="7" r="2.5" fill="#ede9fe"/>
                <circle cx="11" cy="27" r="1.5" fill="#c4b5fd"/>
                <circle cx="53" cy="27" r="1.5" fill="#c4b5fd"/>
                {/* mini star */}
                <path d="M17 13 L17.5 15.5 L20 15.5 L18 17 L18.8 19.5 L17 18 L15.2 19.5 L16 17 L14 15.5 L16.5 15.5 Z" fill="#ede9fe" opacity="0.8"/>
                {/* mysterious face */}
                <ellipse cx="28" cy="21" rx="2.5" ry="2" fill="#1e1b4b"/>
                <ellipse cx="36" cy="21" rx="2.5" ry="2" fill="#1e1b4b"/>
                <circle cx="28.5" cy="21" r="1" fill="#818cf8"/>
                <circle cx="36.5" cy="21" r="1" fill="#818cf8"/>
                <path d="M27 26 Q32 28.5 37 26" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L18 · Druide végétal / Plant Druid ─────────────────────────────────
        case 18: return (
            <>
                <ellipse cx="32" cy="59" rx="24" ry="4" fill="#3b0764"/>
                {/* roots */}
                <path d="M28 57 Q22 59 16 57" stroke="#4c1d95" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M36 57 Q42 59 48 57" stroke="#4c1d95" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* gnarled ancient trunk */}
                <path d="M28 57 Q25 46 26 36 Q27 27 24 18" stroke="#6d28d9" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M36 57 Q39 46 38 36 Q37 27 40 18" stroke="#5b21b6" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path d="M32 57 Q32 42 32 27" stroke="#7c3aed" strokeWidth="4" fill="none" strokeLinecap="round"/>
                {/* large dark canopy */}
                <circle cx="32" cy="15" r="18" fill="#4c1d95"/>
                <circle cx="32" cy="15" r="14" fill="#6d28d9"/>
                {/* purple fire/magic tendrils */}
                <ellipse cx="14" cy="15" rx="5" ry="9" fill="#8b5cf6" opacity="0.55" transform="rotate(10 14 15)"/>
                <ellipse cx="50" cy="15" rx="5" ry="9" fill="#8b5cf6" opacity="0.55" transform="rotate(-10 50 15)"/>
                <ellipse cx="32" cy="1" rx="4" ry="7" fill="#a78bfa" opacity="0.5"/>
                {/* mystical glowing eyes */}
                <ellipse cx="27.5" cy="14" rx="3" ry="2.5" fill="#1e1b4b"/>
                <ellipse cx="36.5" cy="14" rx="3" ry="2.5" fill="#1e1b4b"/>
                <circle cx="27.5" cy="14" r="1.5" fill="#a78bfa"/>
                <circle cx="36.5" cy="14" r="1.5" fill="#a78bfa"/>
                {/* rune marking */}
                <path d="M28 19 Q30 20 32 19 Q34 20 36 19" stroke="#c4b5fd" strokeWidth="1.2" fill="none"/>
                <circle cx="32" cy="9" r="2" fill="#ede9fe" opacity="0.8"/>
            </>
        );

        // ── L19 · Gardien de la nature / Nature Guardian ───────────────────────
        case 19: return (
            <>
                <ellipse cx="32" cy="59" rx="26" ry="4" fill="#164e63"/>
                <rect x="22" y="36" width="20" height="24" rx="10" fill="#155e75"/>
                {/* powerful canopy */}
                <circle cx="32" cy="20" r="23" fill="#0e7490"/>
                <circle cx="12" cy="24" r="11" fill="#0f766e"/>
                <circle cx="52" cy="24" r="11" fill="#0f766e"/>
                {/* energy swirls */}
                <path d="M10 22 Q5 16 12 10 Q18 5 22 12" stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round"/>
                <path d="M54 22 Q59 16 52 10 Q46 5 42 12" stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round"/>
                {/* leaf crown */}
                <ellipse cx="22" cy="5" rx="5" ry="3" fill="#22c55e" transform="rotate(-30 22 5)"/>
                <ellipse cx="32" cy="2" rx="5" ry="3" fill="#4ade80"/>
                <ellipse cx="42" cy="5" rx="5" ry="3" fill="#22c55e" transform="rotate(30 42 5)"/>
                <path d="M24 4 Q32 0 40 4" stroke="#86efac" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* face area */}
                <circle cx="32" cy="21" r="13" fill="#06b6d4"/>
                {/* strong confident face */}
                <ellipse cx="27.5" cy="19.5" rx="2.8" ry="2.2" fill="#083344"/>
                <ellipse cx="36.5" cy="19.5" rx="2.8" ry="2.2" fill="#083344"/>
                <circle cx="27.5" cy="19.5" r="1.2" fill="#67e8f9"/>
                <circle cx="36.5" cy="19.5" r="1.2" fill="#67e8f9"/>
                <path d="M26 25 Q32 29 38 25" stroke="#083344" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </>
        );

        // ── L20 · Esprit du jardin / Garden Spirit ──────────────────────────────
        default: return (
            <>
                {/* radiant aura rings */}
                <circle cx="32" cy="32" r="31" fill="#713f12" opacity="0.08"/>
                <circle cx="32" cy="32" r="27" fill="#92400e" opacity="0.1"/>
                <circle cx="32" cy="32" r="23" fill="#b45309" opacity="0.13"/>
                {/* golden ethereal body */}
                <ellipse cx="32" cy="41" rx="13" ry="16" fill="#b45309"/>
                <ellipse cx="32" cy="41" rx="9" ry="13" fill="#d97706"/>
                {/* energy tendrils */}
                <path d="M20 43 Q8 36 4 27 Q10 33 18 37" fill="#fbbf24" opacity="0.55"/>
                <path d="M44 43 Q56 36 60 27 Q54 33 46 37" fill="#fbbf24" opacity="0.55"/>
                <path d="M22 31 Q10 22 12 11 Q18 20 20 29" fill="#fde68a" opacity="0.5"/>
                <path d="M42 31 Q54 22 52 11 Q46 20 44 29" fill="#fde68a" opacity="0.5"/>
                {/* radiant head */}
                <circle cx="32" cy="20" r="15" fill="#d97706"/>
                <circle cx="32" cy="20" r="12" fill="#f59e0b"/>
                <circle cx="32" cy="20" r="9" fill="#fbbf24"/>
                {/* transcendent face */}
                <ellipse cx="27.5" cy="18.5" rx="3" ry="2.5" fill="#1c1917"/>
                <ellipse cx="36.5" cy="18.5" rx="3" ry="2.5" fill="#1c1917"/>
                <circle cx="27.5" cy="18.5" r="1.5" fill="#fde047"/>
                <circle cx="36.5" cy="18.5" r="1.5" fill="#fde047"/>
                <path d="M26 23.5 Q32 28.5 38 23.5" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* golden crown */}
                <path d="M23 10 L25 14 L28 11 L32 14 L36 11 L39 14 L41 10" stroke="#fde047" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
                {/* star sparkles */}
                <circle cx="16" cy="16" r="2" fill="#fde047" opacity="0.8"/>
                <circle cx="48" cy="16" r="2" fill="#fde047" opacity="0.8"/>
                <circle cx="20" cy="7" r="1.5" fill="#fde68a" opacity="0.7"/>
                <circle cx="44" cy="7" r="1.5" fill="#fde68a" opacity="0.7"/>
                <circle cx="32" cy="4" r="2" fill="#fbbf24" opacity="0.9"/>
            </>
        );
    }
}
