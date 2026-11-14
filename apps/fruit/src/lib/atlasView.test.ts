import { describe, expect, it } from "vitest";
import {
  IDLE_POINTER,
  INITIAL_ATLAS_VIEW,
  MAX_ATLAS_SCALE,
  MIN_ATLAS_SCALE,
  atlasPointerReducer,
  draggedPan,
  zoomAtlasView,
  type AtlasPointerEvent,
} from "./atlasView";

const run = (events: AtlasPointerEvent[]) => events.reduce(atlasPointerReducer, IDLE_POINTER);
const down: AtlasPointerEvent = { type: "down", at: { x: 10, y: 10 }, pan: { x: 5, y: 0 } };

describe("atlas view", () => {
  it("keeps the point under the cursor in place while zooming", () => {
    const focus = { x: 200, y: 100 };
    const view = zoomAtlasView({ scale: 2, pan: { x: -40, y: 30 } }, focus, 1.5);
    expect(view.scale).toBe(3);
    // Map position under the cursor before and after: (focus - pan) / scale.
    expect((focus.x - view.pan.x) / view.scale).toBeCloseTo((200 + 40) / 2);
    expect((focus.y - view.pan.y) / view.scale).toBeCloseTo((100 - 30) / 2);
  });

  it("clamps the zoom", () => {
    expect(zoomAtlasView(INITIAL_ATLAS_VIEW, { x: 0, y: 0 }, 1000).scale).toBe(MAX_ATLAS_SCALE);
    expect(zoomAtlasView(INITIAL_ATLAS_VIEW, { x: 0, y: 0 }, 0.001).scale).toBe(MIN_ATLAS_SCALE);
  });
});

describe("atlas pointer", () => {
  it("is a click when released before moving past the threshold", () => {
    expect(run([down, { type: "move", at: { x: 12, y: 11 } }]).kind).toBe("pressed");
    expect(run([down, { type: "move", at: { x: 12, y: 11 } }, { type: "up" }])).toBe(IDLE_POINTER);
  });

  it("becomes a drag past the threshold and pans from where the press started", () => {
    const dragging = { kind: "dragging", origin: { x: 10, y: 10 }, pan: { x: 5, y: 0 } } as const;
    expect(run([down, { type: "move", at: { x: 30, y: 10 } }])).toEqual(dragging);
    expect(draggedPan(dragging, { x: 40, y: 25 })).toEqual({ x: 35, y: 15 });
  });

  it("returns to idle when the touch is cancelled, so later moves do not pan", () => {
    const cancelled = run([down, { type: "move", at: { x: 30, y: 10 } }, { type: "cancel" }]);
    expect(cancelled).toBe(IDLE_POINTER);
    expect(atlasPointerReducer(cancelled, { type: "move", at: { x: 90, y: 90 } })).toBe(
      IDLE_POINTER,
    );
  });
});
