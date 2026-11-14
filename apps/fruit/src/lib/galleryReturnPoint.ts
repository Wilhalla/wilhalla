import { z } from "zod";

const STORAGE_KEY = "seniorennet-fruit-gallery-return";
const MAX_AGE_MS = 10 * 60 * 1000;
const returnPoint = z.object({ url: z.string(), scrollY: z.number(), savedAt: z.number() });

function currentUrl() {
  return `${window.location.pathname}${window.location.search}`;
}

/** Remembers where in the archive grid the visitor is, just before a photo opens. */
export function saveGalleryReturnPoint() {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ url: currentUrl(), scrollY: window.scrollY, savedAt: Date.now() }),
    );
  } catch {
    // Without storage the browser's own scroll restoration still applies.
  }
}

/** The scroll position to return to, when one was saved for this URL in the last ten minutes. */
export function readGalleryReturnPoint(now = Date.now()) {
  try {
    const stored = returnPoint.safeParse(
      JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null"),
    );
    const valid =
      stored.success && stored.data.url === currentUrl() && now - stored.data.savedAt <= MAX_AGE_MS;
    return valid ? stored.data.scrollY : null;
  } catch {
    return null;
  }
}
