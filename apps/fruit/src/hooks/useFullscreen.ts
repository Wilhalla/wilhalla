import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

/** Whether the page shows something full screen. */
export function useFullscreen() {
  return useSyncExternalStore(
    subscribe,
    () => document.fullscreenElement !== null,
    () => false,
  );
}

/** Leaves full screen, or enters it with `element`. Call from a click or key handler. */
export function toggleFullscreen(element: Element) {
  const change = document.fullscreenElement
    ? document.exitFullscreen()
    : element.requestFullscreen();
  // The browser may refuse (no user gesture, not allowed in a frame); the page works without it.
  change.catch(() => undefined);
}
