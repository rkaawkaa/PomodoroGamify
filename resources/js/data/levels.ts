// ─── Level definitions ──────────────────────────────────────────────────────
// 20 levels calculated from cumulative points.
// Thresholds are designed for ~1-2 years of regular use at max level.

export interface Level {
    level: number;
    minPoints: number;   // inclusive lower bound
    color: string;       // tailwind text-color class
    bgColor: string;     // tailwind bg-color class (low opacity)
    borderColor: string; // tailwind border-color class
}

export const LEVELS: Level[] = [
    { level: 1,  minPoints: 0,      color: 'text-amber-600',    bgColor: 'bg-amber-600/10',    borderColor: 'border-amber-600/30'    },
    { level: 2,  minPoints: 50,     color: 'text-lime-400',     bgColor: 'bg-lime-400/10',     borderColor: 'border-lime-400/30'     },
    { level: 3,  minPoints: 150,    color: 'text-green-400',    bgColor: 'bg-green-400/10',    borderColor: 'border-green-400/30'    },
    { level: 4,  minPoints: 300,    color: 'text-emerald-400',  bgColor: 'bg-emerald-400/10',  borderColor: 'border-emerald-400/30'  },
    { level: 5,  minPoints: 500,    color: 'text-green-500',    bgColor: 'bg-green-500/10',    borderColor: 'border-green-500/30'    },
    { level: 6,  minPoints: 800,    color: 'text-green-600',    bgColor: 'bg-green-600/10',    borderColor: 'border-green-600/30'    },
    { level: 7,  minPoints: 1200,   color: 'text-emerald-500',  bgColor: 'bg-emerald-500/10',  borderColor: 'border-emerald-500/30'  },
    { level: 8,  minPoints: 1800,   color: 'text-pink-400',     bgColor: 'bg-pink-400/10',     borderColor: 'border-pink-400/30'     },
    { level: 9,  minPoints: 2600,   color: 'text-emerald-600',  bgColor: 'bg-emerald-600/10',  borderColor: 'border-emerald-600/30'  },
    { level: 10, minPoints: 3600,   color: 'text-rose-400',     bgColor: 'bg-rose-400/10',     borderColor: 'border-rose-400/30'     },
    { level: 11, minPoints: 5000,   color: 'text-teal-400',     bgColor: 'bg-teal-400/10',     borderColor: 'border-teal-400/30'     },
    { level: 12, minPoints: 7000,   color: 'text-green-600',    bgColor: 'bg-green-700/10',    borderColor: 'border-green-700/30'    },
    { level: 13, minPoints: 10000,  color: 'text-lime-500',     bgColor: 'bg-lime-500/10',     borderColor: 'border-lime-500/30'     },
    { level: 14, minPoints: 14000,  color: 'text-emerald-700',  bgColor: 'bg-emerald-700/10',  borderColor: 'border-emerald-700/30'  },
    { level: 15, minPoints: 19000,  color: 'text-lime-600',     bgColor: 'bg-lime-600/10',     borderColor: 'border-lime-600/30'     },
    { level: 16, minPoints: 25000,  color: 'text-amber-500',    bgColor: 'bg-amber-500/10',    borderColor: 'border-amber-500/30'    },
    { level: 17, minPoints: 33000,  color: 'text-violet-400',   bgColor: 'bg-violet-400/10',   borderColor: 'border-violet-400/30'   },
    { level: 18, minPoints: 43000,  color: 'text-purple-400',   bgColor: 'bg-purple-400/10',   borderColor: 'border-purple-400/30'   },
    { level: 19, minPoints: 55000,  color: 'text-cyan-400',     bgColor: 'bg-cyan-400/10',     borderColor: 'border-cyan-400/30'     },
    { level: 20, minPoints: 70000,  color: 'text-yellow-300',   bgColor: 'bg-yellow-300/10',   borderColor: 'border-yellow-300/30'   },
];

/** Returns the Level object for a given cumulative points total. */
export function getLevelForPoints(points: number): Level {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
        if (points >= lvl.minPoints) current = lvl;
        else break;
    }
    return current;
}

/** Returns the next Level, or null if already at max (20). */
export function getNextLevel(lvl: Level): Level | null {
    const idx = LEVELS.findIndex((l) => l.level === lvl.level);
    return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

/**
 * Returns a [0, 1] float representing how far the user has progressed
 * from their current level to the next one.
 */
export function getLevelProgress(points: number): number {
    const current = getLevelForPoints(points);
    const next = getNextLevel(current);
    if (!next) return 1; // max level
    const range = next.minPoints - current.minPoints;
    const gained = points - current.minPoints;
    return Math.min(1, gained / range);
}
