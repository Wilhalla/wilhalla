import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Storage can be unavailable (private browsing); the default applies.
    return null;
  }
}

/**
 * A choice kept in localStorage, shared by every component and tab that reads the same key.
 * `isValue` guards against what an older version or another page stored there.
 */
export function useStoredPreference<T extends string>(
  key: string,
  defaultValue: T,
  isValue: (value: string | null) => value is T,
) {
  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );

  const setValue = (value: T) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Without storage the choice lasts until the page is left.
    }
    for (const listener of listeners) listener();
  };

  return [isValue(stored) ? stored : defaultValue, setValue] as const;
}
