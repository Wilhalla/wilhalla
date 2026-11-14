import type { FetchPriority } from "./clientFetch";
import { loadGalleryIndexChunks, loadGalleryIndexFile } from "./galleryIndexLoader";
import type { GalleryImageRecord } from "./generatedTypes";

/**
 * The image index of a gallery page. It starts with the few photos the page was built with
 * (`seed`), grows while the year files load and ends complete (`ready`) or with what it has and
 * the reason it stopped (`error`).
 */
export type GalleryIndex =
  | { status: "seed"; images: readonly GalleryImageRecord[] }
  | { status: "loading"; images: readonly GalleryImageRecord[] }
  | { status: "ready"; images: readonly GalleryImageRecord[] }
  | { status: "error"; images: readonly GalleryImageRecord[]; message: string };

export type GalleryIndexEvent =
  | { type: "started" }
  | { type: "batch"; images: readonly GalleryImageRecord[] }
  | { type: "completed" }
  | { type: "failed"; message: string };

export function galleryIndexReducer(state: GalleryIndex, event: GalleryIndexEvent): GalleryIndex {
  switch (event.type) {
    case "started":
      return state.status === "ready" ? state : { status: "loading", images: state.images };
    case "batch":
      return state.status === "loading" ? { status: "loading", images: event.images } : state;
    case "completed":
      return state.status === "loading" ? { status: "ready", images: state.images } : state;
    case "failed":
      return state.status === "loading"
        ? { status: "error", images: state.images, message: event.message }
        : state;
  }
}

const listeners = new Set<() => void>();
let state: GalleryIndex | null = null;

function dispatch(seed: readonly GalleryImageRecord[], event: GalleryIndexEvent) {
  state = galleryIndexReducer(state ?? { status: "seed", images: seed }, event);
  for (const listener of listeners) listener();
}

export function subscribeGalleryIndex(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `null` until a load was requested: the page then still shows its seed. */
export function getGalleryIndex() {
  return state;
}

/**
 * Loads the whole index once per page; a second call while loading or when ready does nothing,
 * after an error it tries again. Year files first, the single index file when those fail.
 */
export function requestGalleryIndex(seed: readonly GalleryImageRecord[], priority: FetchPriority) {
  if (state?.status === "loading" || state?.status === "ready") return;
  dispatch(seed, { type: "started" });
  loadGalleryIndexChunks({
    seed,
    priority,
    onBatch: (images) => dispatch(seed, { type: "batch", images }),
  })
    .catch(async () =>
      dispatch(seed, { type: "batch", images: await loadGalleryIndexFile(priority) }),
    )
    .then(
      () => dispatch(seed, { type: "completed" }),
      (error: unknown) =>
        dispatch(seed, {
          type: "failed",
          message: error instanceof Error ? error.message : String(error),
        }),
    );
}
