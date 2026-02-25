/**
 * Palette Nightbloom
 *
 * Une nuit profonde où des couleurs s'allument comme des fleurs dans l'obscurité.
 * Mode travail : sombre, épuré, une seule couleur active (ember).
 * Mode célébration : les couleurs sémantiques explosent en animations.
 *
 * Usage Tailwind  → bg-ember, text-sunbeam, border-boundary …
 * Usage JS/CSS    → theme.timer.focus, theme.gamification.points …
 */

// ─── Palette brute (valeurs HSL sans hsl()) ────────────────────────────────

export const palette = {
    // Structure — du plus sombre au plus clair
    void:     '240 30% 4%',   // Le néant, fond le plus profond
    abyss:    '238 25% 8%',   // Fond de l'application
    depth:    '237 21% 13%',  // Fond des cartes
    surface:  '236 18% 18%',  // Éléments élevés (modales, dropdowns)
    boundary: '235 15% 26%',  // Bordures et séparateurs
    whisper:  '234 10% 56%',  // Texte discret, placeholders
    moonbeam: '232 30% 93%',  // Texte principal

    // Sémantique — les couleurs de vie de l'app
    ember:    '4 68% 58%',    // Timer focus / pomodoro actif — rouge chaleureux
    jade:     '168 52% 50%',  // Pause courte — vert apaisant
    ocean:    '208 70% 56%',  // Pause longue — bleu calme
    sunbeam:  '42 90% 58%',   // Points / XP / récompenses — or chaud
    aurora:   '258 62% 68%',  // Badges / achievements — violet doux
    bloom:    '142 45% 52%',  // Streak / succès — vert vitalité
    coral:    '16 78% 63%',   // Alertes / avertissements — orange doux
} as const;

export type PaletteKey = keyof typeof palette;

// Helpers pour utiliser en JS pur (ex: style={{ color: hsl(palette.ember) }})
export const hsl = (key: PaletteKey) => `hsl(${palette[key]})`;

// ─── Mapping sémantique ────────────────────────────────────────────────────

export const theme = {
    timer: {
        focus:      hsl('ember'),   // Rouge chaud : concentration, urgence douce
        shortBreak: hsl('jade'),    // Vert teal : respiration, fraîcheur
        longBreak:  hsl('ocean'),   // Bleu : profondeur, récupération
    },

    gamification: {
        points:   hsl('sunbeam'),   // Or : valeur, récompense immédiate
        badge:    hsl('aurora'),    // Violet : rareté, magie, accomplissement
        streak:   hsl('bloom'),     // Vert : croissance, régularité, vie
        warning:  hsl('coral'),     // Orange : attention sans agressivité
    },

    ui: {
        pageBg:   hsl('abyss'),
        cardBg:   hsl('depth'),
        elevated: hsl('surface'),
        border:   hsl('boundary'),
        textMuted: hsl('whisper'),
        text:     hsl('moonbeam'),
    },
} as const;
