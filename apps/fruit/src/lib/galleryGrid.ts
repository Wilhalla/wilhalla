import { galleryUrlCodec } from "./galleryFilters";
import { speciesByImageStore } from "./galleryData";
import { getGalleryIndex, requestGalleryIndex, subscribeGalleryIndex } from "./galleryIndex";
import { readGalleryReturnPoint } from "./galleryReturnPoint";
import type { GalleryImageRecord } from "./generatedTypes";
import { needsSpeciesTags } from "./imageGallerySession";

/**
 * Starts what the archive grid needs once it is in the page, and returns how to stop it:
 * the whole image index (right away when the URL filters, otherwise when the browser is idle),
 * the species names when the URL's filters use them, and the visitor's scroll position once
 * every photo is there. Use it as the ref callback of the grid's root element.
 */
export function startGalleryGrid(seed: readonly GalleryImageRecord[]) {
  const filters = galleryUrlCodec.parse(new URLSearchParams(window.location.search));
  if (needsSpeciesTags(filters)) speciesByImageStore.request();

  const load = () => requestGalleryIndex(seed, "low");
  const timer = window.setTimeout(load, window.location.search ? 0 : 250);

  let frame = 0;
  const unsubscribe = subscribeGalleryIndex(() => {
    const scrollY = readGalleryReturnPoint();
    if (getGalleryIndex()?.status !== "ready" || scrollY === null) return;
    unsubscribe();
    // After React has rendered the full list and the virtualizer knows its height.
    frame = requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
  });

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    unsubscribe();
  };
}
