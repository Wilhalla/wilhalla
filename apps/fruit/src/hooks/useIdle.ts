import { useSyncExternalStore } from "react";

const ACTIVITY_EVENTS = ["mousemove", "pointerdown", "touchstart", "keydown"] as const;
let idle = false;

/** Whether the visitor has not moved, pressed or typed for `delayMs`. One user per page. */
export function useIdle(delayMs: number) {
  return useSyncExternalStore(
    (onChange) => {
      const setIdle = (next: boolean) => {
        if (idle === next) return;
        idle = next;
        onChange();
      };
      let timer = window.setTimeout(setIdle, delayMs, true);
      const wake = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(setIdle, delayMs, true);
        setIdle(false);
      };

      for (const name of ACTIVITY_EVENTS) window.addEventListener(name, wake, { passive: true });
      return () => {
        window.clearTimeout(timer);
        idle = false;
        for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, wake);
      };
    },
    () => idle,
    () => false,
  );
}
