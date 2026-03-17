import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_THEME_ID, getTheme, Theme } from '@/data/themes';

export type ColorMode = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    setThemeId: (id: string) => void;
    colorMode: ColorMode;
    toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: getTheme(DEFAULT_THEME_ID),
    setThemeId: () => {},
    colorMode: 'dark',
    toggleColorMode: () => {},
});

function readStoredThemeId(): string {
    try {
        return localStorage.getItem('pomobloom_theme') ?? DEFAULT_THEME_ID;
    } catch {
        return DEFAULT_THEME_ID;
    }
}

function readStoredColorMode(): ColorMode {
    try {
        const stored = localStorage.getItem('pomobloom_color_mode');
        return stored === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
}

function injectCssVars(theme: Theme) {
    let el = document.getElementById('pomobloom-theme-vars') as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement('style');
        el.id = 'pomobloom-theme-vars';
        document.head.appendChild(el);
    }
    el.textContent = `:root {
  --ember: ${theme.colors.ember};
  --bloom: ${theme.colors.bloom};
  --coral: ${theme.colors.coral};
  --aurora: ${theme.colors.aurora};
}`;
}

function applyColorMode(mode: ColorMode) {
    document.documentElement.setAttribute('data-color-mode', mode);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeId, setThemeIdState]     = useState<string>(readStoredThemeId);
    const [colorMode, setColorModeState] = useState<ColorMode>(readStoredColorMode);
    const theme = getTheme(themeId);

    useEffect(() => {
        injectCssVars(theme);
    }, [theme]);

    useEffect(() => {
        applyColorMode(colorMode);
    }, [colorMode]);

    const setThemeId = (id: string) => {
        try { localStorage.setItem('pomobloom_theme', id); } catch { /* silent */ }
        setThemeIdState(id);
    };

    const toggleColorMode = () => {
        setColorModeState((prev) => {
            const next: ColorMode = prev === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem('pomobloom_color_mode', next); } catch { /* silent */ }
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeId, colorMode, toggleColorMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    return useContext(ThemeContext);
}
