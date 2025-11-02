import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (typeof window.matchMedia !== 'function') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const readStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    try {
        return (
            (window.localStorage.getItem('appearance') as Appearance | null) ||
            'light'
        );
    } catch {
        return 'light';
    }
};

const persistAppearance = (mode: Appearance) => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem('appearance', mode);
    } catch {
        // Ignore storage errors (e.g. Safari private browsing)
    }
};

const applyTheme = (appearance: Appearance) => {
    const isDark =
        appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const addSystemThemeChangeListener = (
    listener: (event: MediaQueryListEvent) => void,
) => {
    const query = mediaQuery();

    if (!query) {
        return () => undefined;
    }

    if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', listener);

        return () => query.removeEventListener('change', listener);
    }

    if (typeof query.addListener === 'function') {
        query.addListener(listener);

        return () => query.removeListener(listener);
    }

    return () => undefined;
};

const handleSystemThemeChange = () => {
    applyTheme(readStoredAppearance());
};

export function initializeTheme() {
    applyTheme(readStoredAppearance());

    // Add the event listener for system theme changes...
    addSystemThemeChangeListener(handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        persistAppearance(mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateAppearance(readStoredAppearance());

        const removeListener = addSystemThemeChangeListener(
            handleSystemThemeChange,
        );

        return () => removeListener();
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
