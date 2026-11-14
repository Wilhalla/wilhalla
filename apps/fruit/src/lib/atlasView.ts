import type { ScreenPoint } from "./archiveAtlas";

/** Pan and zoom of the atlas, and what the pointer is doing: pure state, drawn by atlasRenderer. */
export interface AtlasView {
  scale: number;
  pan: ScreenPoint;
}

export const MIN_ATLAS_SCALE = 0.75;
export const MAX_ATLAS_SCALE = 18;
export const INITIAL_ATLAS_VIEW: AtlasView = { scale: 1, pan: { x: 0, y: 0 } };

/** Zooms by `factor`, keeping the map position under `focus` (canvas pixels) in place. */
export function zoomAtlasView(view: AtlasView, focus: ScreenPoint, factor: number): AtlasView {
  const scale = Math.min(Math.max(view.scale * factor, MIN_ATLAS_SCALE), MAX_ATLAS_SCALE);
  const applied = scale / view.scale;
  return {
    scale,
    pan: {
      x: focus.x - (focus.x - view.pan.x) * applied,
      y: focus.y - (focus.y - view.pan.y) * applied,
    },
  };
}

/**
 * A press becomes a drag once it has moved `DRAG_THRESHOLD` pixels; released before that, it is
 * a click. `origin` is where the press started and `pan` the pan at that moment.
 */
export type AtlasPointer =
  | { kind: "idle" }
  | { kind: "pressed"; origin: ScreenPoint; pan: ScreenPoint }
  | { kind: "dragging"; origin: ScreenPoint; pan: ScreenPoint };

export type AtlasPointerEvent =
  | { type: "down"; at: ScreenPoint; pan: ScreenPoint }
  | { type: "move"; at: ScreenPoint }
  | { type: "up" }
  | { type: "cancel" };

const DRAG_THRESHOLD = 4;
export const IDLE_POINTER: AtlasPointer = { kind: "idle" };

export function atlasPointerReducer(pointer: AtlasPointer, event: AtlasPointerEvent): AtlasPointer {
  switch (event.type) {
    case "down":
      return { kind: "pressed", origin: event.at, pan: event.pan };
    case "move": {
      if (pointer.kind !== "pressed") return pointer;
      const dx = event.at.x - pointer.origin.x;
      const dy = event.at.y - pointer.origin.y;
      return dx * dx + dy * dy > DRAG_THRESHOLD ** 2 ? { ...pointer, kind: "dragging" } : pointer;
    }
    case "up":
    case "cancel":
      return IDLE_POINTER;
  }
}

/** The pan while dragging with the pointer at `at`. */
export function draggedPan(
  pointer: Extract<AtlasPointer, { kind: "dragging" }>,
  at: ScreenPoint,
): ScreenPoint {
  return {
    x: pointer.pan.x + at.x - pointer.origin.x,
    y: pointer.pan.y + at.y - pointer.origin.y,
  };
}
