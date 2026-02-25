interface AppLogoProps {
    className?: string;
    size?: number;
}

/**
 * Logo PomoBloom
 *
 * Outer ring: timer arc (300°, gap at 12 o'clock)
 * Inner flower: 5-petal sakura (ellipses rotated 72° apart)
 * Timer hand + center dot layered on top
 */
export default function AppLogo({ className = '', size = 36 }: AppLogoProps) {
    // circumference = 2π × 15.5 ≈ 97.39
    // 300° dash ≈ 81.16 · 60° gap ≈ 16.23
    // rotate(-60) → gap centered at 12 o'clock
    const petalAngles = [0, 72, 144, 216, 288];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="PomoBloom"
        >
            {/* Timer arc ring */}
            <circle
                cx="18"
                cy="18"
                r="15.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="81.16 16.23"
                transform="rotate(-60, 18, 18)"
                fill="none"
            />

            {/* Sakura petals — 5 ellipses rotated 72° apart */}
            {petalAngles.map((angle) => (
                <ellipse
                    key={angle}
                    cx="18"
                    cy="12.2"
                    rx="2.4"
                    ry="3.8"
                    fill="currentColor"
                    opacity="0.82"
                    transform={`rotate(${angle}, 18, 18)`}
                />
            ))}

            {/* Small stamen circle behind the hand */}
            <circle cx="18" cy="18" r="1.6" fill="currentColor" opacity="0.5" />

            {/* Timer hand — points to 12 o'clock */}
            <line
                x1="18"
                y1="18"
                x2="18"
                y2="13.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Center pivot */}
            <circle cx="18" cy="18" r="1.8" fill="currentColor" />
        </svg>
    );
}
