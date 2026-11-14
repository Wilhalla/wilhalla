import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);

  return () => window.removeEventListener("resize", onChange);
}

/** The window's inner size in CSS pixels; `null` on the server and until hydration. */
export function useViewportSize() {
  const width = useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => null,
  );
  const height = useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => null,
  );

  return width === null || height === null ? null : { width, height };
}
