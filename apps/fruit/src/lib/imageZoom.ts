export const IMAGE_SCALE_MODES = ["fit", "width", "height", "cover", "original"] as const;
export type ImageScaleMode = (typeof IMAGE_SCALE_MODES)[number];

export function isImageScaleMode(value: string | null): value is ImageScaleMode {
  return IMAGE_SCALE_MODES.some((mode) => mode === value);
}

export const IMAGE_ZOOM = { min: 1, max: 5, step: 0.25, doubleClick: 2.5 } as const;
export const LENS = { min: 1.5, max: 6, step: 0.25, initial: 2.5 } as const;
/** How far, in pixels, a zoomed photo may be dragged past the edge of the stage. */
const PAN_SLACK = 80;

export interface Point {
  x: number;
  y: number;
}

/** How much the photo is enlarged and how far it is moved from the centre of the stage. */
export interface ZoomView {
  zoom: number;
  pan: Point;
}

/** Layout sizes in pixels, measured without the zoom transform. */
export interface ZoomBounds {
  imageWidth: number;
  imageHeight: number;
  stageWidth: number;
  stageHeight: number;
}

/**
 * The viewer's zoom. `subject` names the photo and scale mode the view belongs to: for another
 * subject the view starts over, the magnifier and its strength carry on.
 * The magnifier and an enlarged view exclude each other.
 */
export interface ZoomState extends ZoomView {
  subject: string;
  lens: boolean;
  lensStrength: number;
}

export type ZoomEvent = { subject: string } & (
  | { type: "view"; view: ZoomView }
  | { type: "reset" }
  | { type: "lens"; on: boolean }
  | { type: "lensStrength"; value: number }
);

export const unzoomed: ZoomView = { zoom: IMAGE_ZOOM.min, pan: { x: 0, y: 0 } };

export function initialZoomState(subject: string): ZoomState {
  return { ...unzoomed, subject, lens: false, lensStrength: LENS.initial };
}

/** The state as it applies to `subject`. */
export function zoomStateFor(state: ZoomState, subject: string): ZoomState {
  return state.subject === subject ? state : { ...state, ...unzoomed, subject };
}

export function zoomReducer(previous: ZoomState, event: ZoomEvent): ZoomState {
  const state = zoomStateFor(previous, event.subject);
  switch (event.type) {
    case "view":
      return { ...state, ...event.view, lens: state.lens && event.view.zoom <= IMAGE_ZOOM.min };
    case "reset":
      return { ...state, ...unzoomed };
    case "lens":
      return event.on ? { ...state, ...unzoomed, lens: true } : { ...state, lens: false };
    case "lensStrength":
      return { ...state, lensStrength: clamp(event.value, LENS.min, LENS.max) };
  }
}

export function isZoomChanged({ zoom, pan }: ZoomView) {
  return zoom > IMAGE_ZOOM.min || Math.abs(pan.x) > 0.5 || Math.abs(pan.y) > 0.5;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** A photo can be moved when it is enlarged, or when "cover" lets it overflow the stage. */
export function canPan(mode: ImageScaleMode, zoom: number) {
  return mode === "cover" || zoom > IMAGE_ZOOM.min;
}

export function clampView(view: ZoomView, bounds: ZoomBounds, mode: ImageScaleMode): ZoomView {
  const zoom = clamp(view.zoom, IMAGE_ZOOM.min, IMAGE_ZOOM.max);
  if (!canPan(mode, zoom)) return { zoom, pan: { x: 0, y: 0 } };

  const slack = mode === "cover" ? 0 : PAN_SLACK;
  const maxX = Math.max(0, (bounds.imageWidth * zoom - bounds.stageWidth) / 2 + slack);
  const maxY = Math.max(0, (bounds.imageHeight * zoom - bounds.stageHeight) / 2 + slack);
  return { zoom, pan: { x: clamp(view.pan.x, -maxX, maxX), y: clamp(view.pan.y, -maxY, maxY) } };
}

/**
 * Zooms to `zoom` keeping the point under `focal` in place; `focal` is measured from the centre
 * of the photo where it lies without pan. Without a focal point the pan is kept.
 */
export function zoomAround(
  view: ZoomView,
  zoom: number,
  focal: Point | null,
  bounds: ZoomBounds,
  mode: ImageScaleMode,
): ZoomView {
  const next = clamp(zoom, IMAGE_ZOOM.min, IMAGE_ZOOM.max);
  const ratio = next / view.zoom;
  const pan = focal
    ? {
        x: focal.x - (focal.x - view.pan.x) * ratio,
        y: focal.y - (focal.y - view.pan.y) * ratio,
      }
    : view.pan;
  return clampView({ zoom: next, pan }, bounds, mode);
}

/** Zoom steps of the toolbar and the wheel land on multiples of the step. */
export function stepZoom(zoom: number, direction: 1 | -1) {
  return Math.round((zoom + direction * IMAGE_ZOOM.step) / IMAGE_ZOOM.step) * IMAGE_ZOOM.step;
}

/**
 * Whether the wheel zooms. Where the photo is larger than the stage and scrolls ("width" and
 * "original" at normal size) the plain wheel scrolls, and zooming takes Ctrl or a pinch on a
 * trackpad (which browsers report as Ctrl + wheel).
 */
export function wheelZooms(mode: ImageScaleMode, zoom: number, ctrlKey: boolean) {
  const scrolls = (mode === "width" || mode === "original") && zoom <= IMAGE_ZOOM.min;
  return ctrlKey || !scrolls;
}

/** One finger pans vertically through the page until the photo itself can be moved. */
export function touchAction(mode: ImageScaleMode, zoom: number, lens: boolean) {
  return lens || canPan(mode, zoom) ? "none" : "pan-y";
}
