import { useState } from "react";

/**
 * The element's distance from the top of its offset parent, kept current when the page above it
 * changes height. Returns the ref callback to attach and the measured offset.
 */
export function useOffsetTop() {
  const [offsetTop, setOffsetTop] = useState(0);

  const ref = (element: HTMLElement | null) => {
    if (!element) return undefined;
    const measure = () => setOffsetTop(element.offsetTop);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  };

  return [ref, offsetTop] as const;
}
