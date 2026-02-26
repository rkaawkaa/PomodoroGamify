import { useCallback, useState } from 'react';

/**
 * Synchronise un état React avec localStorage.
 * Lecture initiale depuis localStorage (fallback : initialValue).
 * Chaque appel à setValue persiste immédiatement.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            setStoredValue((prev) => {
                const next =
                    typeof value === 'function'
                        ? (value as (val: T) => T)(prev)
                        : value;
                try {
                    window.localStorage.setItem(key, JSON.stringify(next));
                } catch {
                    /* quota or private-browsing — silent fail */
                }
                return next;
            });
        },
        [key],
    );

    return [storedValue, setValue] as const;
}
