import type { GalleryImageRecord } from "./generatedTypes";

export const SLIDESHOW_MODES = ["chronological", "random"] as const;
export type SlideshowMode = (typeof SLIDESHOW_MODES)[number];
export const SLIDESHOW_SECONDS = [3, 5, 8, 12, 20, 30] as const;

export function isSlideshowMode(value: string): value is SlideshowMode {
  return SLIDESHOW_MODES.some((mode) => mode === value);
}

/** How the slideshow plays. Which slide it shows is not here: the URL owns that. */
export interface SlideshowSettings {
  mode: SlideshowMode;
  seconds: number;
  paused: boolean;
  /** Picks the random order; a new seed is a new shuffle. */
  seed: number;
}

export type SlideshowEvent =
  | { type: "mode"; mode: SlideshowMode; seed: number }
  | { type: "seconds"; seconds: number }
  | { type: "togglePaused" };

export const initialSlideshowSettings: SlideshowSettings = {
  mode: "chronological",
  seconds: 5,
  paused: false,
  seed: 0,
};

export function slideshowReducer(
  state: SlideshowSettings,
  event: SlideshowEvent,
): SlideshowSettings {
  switch (event.type) {
    case "mode":
      return { ...state, mode: event.mode, seed: event.seed };
    case "seconds":
      return SLIDESHOW_SECONDS.some((seconds) => seconds === event.seconds)
        ? { ...state, seconds: event.seconds }
        : state;
    case "togglePaused":
      return { ...state, paused: !state.paused };
  }
}

type Slide = Pick<GalleryImageRecord, "id" | "date" | "isoDate" | "year" | "month">;

function chronologyTime(image: Slide) {
  const parsed = Date.parse(image.isoDate || image.date);
  if (Number.isFinite(parsed)) return parsed;
  return image.year
    ? Date.UTC(image.year, Math.max(0, (image.month ?? 1) - 1), 1)
    : Number.POSITIVE_INFINITY;
}

/** FNV-1a: a stable number per (seed, id), so photos keep their place when more are loaded. */
function shuffleKey(seed: number, id: string) {
  let hash = 0x811c9dc5 ^ seed;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 0x01000193);
  }
  return hash >>> 0;
}

/**
 * The order the slideshow plays in, derived from every photo known now: photos that load later
 * join the sequence without disturbing the order of those already in it.
 */
export function slideshowOrder<T extends Slide>(
  images: readonly T[],
  { mode, seed }: Pick<SlideshowSettings, "mode" | "seed">,
) {
  return mode === "random"
    ? images.toSorted(
        (a, b) => shuffleKey(seed, a.id) - shuffleKey(seed, b.id) || a.id.localeCompare(b.id),
      )
    : images.toSorted((a, b) => chronologyTime(a) - chronologyTime(b) || a.id.localeCompare(b.id));
}

/** The slide `step` places from `currentId`, wrapping around; the first when `currentId` is not in the order. */
export function slideAt<T extends Slide>(order: readonly T[], currentId: string, step: number) {
  const index = order.findIndex((image) => image.id === currentId);
  return order.at((Math.max(index, 0) + step) % order.length);
}

/**
 * The cross-fade between slides. `loadedId` is the slide whose image has arrived; `previousId`
 * is the slide that stays on screen underneath until the next one has loaded and faded in.
 */
export interface SlideTransition {
  loadedId: string | null;
  previousId: string | null;
}

export type SlideTransitionEvent =
  | { type: "leave"; id: string }
  | { type: "loaded"; id: string }
  | { type: "faded" };

export const initialSlideTransition: SlideTransition = { loadedId: null, previousId: null };

export function slideTransitionReducer(
  state: SlideTransition,
  event: SlideTransitionEvent,
): SlideTransition {
  switch (event.type) {
    case "leave":
      // A slide that never arrived has nothing to leave behind: the one before it stays.
      return state.loadedId === event.id ? { ...state, previousId: event.id } : state;
    case "loaded":
      return { ...state, loadedId: event.id };
    case "faded":
      return { ...state, previousId: null };
  }
}
