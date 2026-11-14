import { useSyncExternalStore } from "react";
import { getGalleryIndex, subscribeGalleryIndex, type GalleryIndex } from "../lib/galleryIndex";
import type { GalleryImageRecord } from "../lib/generatedTypes";

/** The page's image index: the seed until a load is requested, then the store's state. */
export function useGalleryIndex(seed: readonly GalleryImageRecord[]): GalleryIndex {
  const index = useSyncExternalStore(subscribeGalleryIndex, getGalleryIndex, () => null);
  return index ?? { status: "seed", images: seed };
}
