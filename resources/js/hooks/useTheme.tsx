import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_THEME_ID, getTheme, Theme } from '@/data/themes';

interface ThemeContextType {
    theme: Theme;
    setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: getTheme(DEFAULT_THEME_ID),
    setThemeId: () => {},
});

function readStoredThemeId(): string {
    try {
        return localStorage.getItem('pomobloom_theme') ?? DEFAULT_THEME_ID;
    } catch {
        return DEFAULT_THEME_ID;
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeId, setThemeIdState] = useState<string>(readStoredThemeId);
    const theme = getTheme(themeId);

    // Inject CSS variables whenever theme changes
    useEffect(() => {
        injectCssVars(theme);
    }, [theme]);

    const setThemeId = (id: string) => {
        try { localStorage.setItem('pomobloom_theme', id); } catch { /* silent */ }
        setThemeIdState(id);
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeId }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    return useContext(ThemeContext);
}
