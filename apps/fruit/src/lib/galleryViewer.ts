import { speciesByImageStore, relatedImagesStore } from "./galleryData";
import { galleryUrlCodec } from "./galleryFilters";
import { requestGalleryIndex, type GalleryIndex } from "./galleryIndex";
import { needsSpeciesTags } from "./imageGallerySession";
import type { GalleryImageRecord } from "./generatedTypes";

/** What the viewer page shows; exactly one of these at a time. */
export type ViewerView =
  | { kind: "hydrating" }
  | { kind: "noImage" }
  | { kind: "loading"; slideshow: boolean }
  | { kind: "failed"; message: string }
  | { kind: "notFound" }
  | { kind: "image"; image: GalleryImageRecord }
  | { kind: "slideshow"; image: GalleryImageRecord };

export function viewerView({
  hydrated,
  imageId,
  index,
  slideshow,
}: {
  /** False on the server and while hydrating, when the URL is not known yet. */
  hydrated: boolean;
  imageId: string | null;
  index: GalleryIndex;
  /** Whether the URL is the slideshow's. */
  slideshow: boolean;
}): ViewerView {
  if (!hydrated) return { kind: "hydrating" };
  if (!imageId) return { kind: "noImage" };

  const image = index.images.find((item) => item.id === imageId);
  if (image) return { kind: slideshow ? "slideshow" : "image", image };
  if (index.status === "error") return { kind: "failed", message: index.message };
  if (index.status === "ready") return { kind: "notFound" };
  return { kind: "loading", slideshow };
}

/** Elements that use the arrow keys or Escape themselves. */
export const KEY_CONSUMERS =
  "input, textarea, select, [contenteditable], [role=slider], [role=menu], [role=listbox], [role=combobox]";

export type ViewerKeyAction = "previous" | "next" | "exit";

/** What a key press on the viewer means, or nothing when the key belongs to something else. */
export function viewerKeyAction(event: {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  defaultPrevented: boolean;
  /** Whether the key was pressed inside an element that handles it (`KEY_CONSUMERS`). */
  consumed: boolean;
}): ViewerKeyAction | null {
  if (event.defaultPrevented || event.consumed) return null;
  // Alt+Left is the browser's "back", Ctrl/Cmd+arrow moves through text or tabs.
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null;
  if (event.key === "ArrowLeft") return "previous";
  if (event.key === "ArrowRight") return "next";
  if (event.key === "Escape") return "exit";
  return null;
}

/**
 * How "Beeldarchief" leaves the viewer: back through history when the visitor came from the
 * archive grid (which restores their place there), otherwise by opening the archive.
 */
export function galleryExit(referrer: string, origin: string): "back" | "open" {
  if (!URL.canParse(referrer)) return "open";
  const from = new URL(referrer);
  return from.origin === origin && from.pathname === "/gallery/" ? "back" : "open";
}

/**
 * Starts what the viewer needs once it is in the page: the whole image index (the photo in the
 * URL is rarely among the few the page was built with), the similar photos, and the species
 * names when the URL's filters use them. Use it as the ref callback of the viewer's root.
 */
export function startGalleryViewer(seed: readonly GalleryImageRecord[]) {
  const state = galleryUrlCodec.parse(new URLSearchParams(window.location.search));
  if (!state.imageId) return;
  requestGalleryIndex(seed, "high");
  relatedImagesStore.request();
  if (needsSpeciesTags(state)) speciesByImageStore.request();
}
