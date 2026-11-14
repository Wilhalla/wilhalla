import { useEffect, useEffectEvent } from "react";

/**
 * Calls `onElapsed` once, `delayMs` after the timer starts. It starts when `delayMs` becomes a
 * number and starts over when that number changes; `null` stops it.
 */
export function useTimeout(onElapsed: () => void, delayMs: number | null) {
  const elapsed = useEffectEvent(onElapsed);

  useEffect(() => {
    if (delayMs === null) return undefined;
    const timer = window.setTimeout(elapsed, delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);
}
