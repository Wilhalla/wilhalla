import { describe, expect, it } from "vitest";
import {
  clampView,
  initialZoomState,
  isZoomChanged,
  stepZoom,
  touchAction,
  unzoomed,
  wheelZooms,
  zoomAround,
  zoomReducer,
  zoomStateFor,
} from "./imageZoom";

const bounds = { imageWidth: 800, imageHeight: 600, stageWidth: 1000, stageHeight: 700 };

describe("image zoom", () => {
  it("starts over for another photo or scale mode, keeping the magnifier", () => {
    const zoomed = zoomReducer(initialZoomState("a:fit"), {
      type: "view",
      subject: "a:fit",
      view: { zoom: 2, pan: { x: 10, y: 0 } },
    });
    const lens = zoomReducer(zoomed, { type: "lensStrength", subject: "a:fit", value: 4 });

    expect(zoomStateFor(lens, "b:fit")).toMatchObject({
      zoom: 1,
      pan: { x: 0, y: 0 },
      lensStrength: 4,
    });
    // An event for the new photo does not act on the old photo's view.
    expect(zoomReducer(lens, { type: "lens", subject: "b:fit", on: false })).toMatchObject({
      subject: "b:fit",
      zoom: 1,
    });
  });

  it("never has the magnifier and an enlarged view at once", () => {
    const lens = zoomReducer(initialZoomState("a"), { type: "lens", subject: "a", on: true });
    const zoomed = zoomReducer(lens, {
      type: "view",
      subject: "a",
      view: { zoom: 2, pan: { x: 0, y: 0 } },
    });

    expect(lens).toMatchObject({ lens: true, zoom: 1 });
    expect(zoomed).toMatchObject({ lens: false, zoom: 2 });
    expect(zoomReducer(zoomed, { type: "lens", subject: "a", on: true })).toMatchObject({
      lens: true,
      zoom: 1,
    });
    expect(
      zoomReducer(zoomed, { type: "lensStrength", subject: "a", value: 99 }).lensStrength,
    ).toBe(6);
    expect(zoomReducer(zoomed, { type: "reset", subject: "a" })).toMatchObject(unzoomed);
  });

  it("keeps the point under the pointer in place while zooming", () => {
    const focal = { x: 100, y: -50 };
    const view = zoomAround(unzoomed, 2, focal, bounds, "fit");

    // The photo point that was under the pointer is (focal - pan) / zoom from the centre.
    expect((focal.x - view.pan.x) / view.zoom).toBeCloseTo(focal.x);
    expect((focal.y - view.pan.y) / view.zoom).toBeCloseTo(focal.y);
    expect(zoomAround(view, 2.25, null, bounds, "fit").pan).toEqual(view.pan);
  });

  it("limits zoom and how far the photo can be dragged off the stage", () => {
    expect(clampView({ zoom: 9, pan: { x: 0, y: 0 } }, bounds, "fit").zoom).toBe(5);
    // At normal size a fitted photo does not move; "cover" may, as far as it overflows.
    expect(clampView({ zoom: 1, pan: { x: 300, y: 300 } }, bounds, "fit").pan).toEqual({
      x: 0,
      y: 0,
    });
    expect(
      clampView({ zoom: 1, pan: { x: 300, y: 300 } }, { ...bounds, imageWidth: 1400 }, "cover").pan,
    ).toEqual({ x: 200, y: 0 });
    // Twice 800 wide on a stage of 1000: 300 of overflow each side, plus 80 of slack.
    expect(clampView({ zoom: 2, pan: { x: 999, y: -999 } }, bounds, "fit").pan).toEqual({
      x: 380,
      y: -330,
    });
    expect(isZoomChanged(unzoomed)).toBe(false);
    expect(isZoomChanged({ zoom: 1, pan: { x: 3, y: 0 } })).toBe(true);
  });

  it("steps on the zoom grid, also from a pinched in-between value", () => {
    expect(stepZoom(1, 1)).toBe(1.25);
    expect(stepZoom(1.4, 1)).toBe(1.75);
    expect(stepZoom(1.4, -1)).toBe(1.25);
  });

  it("lets the wheel scroll where the photo scrolls, and zoom elsewhere", () => {
    expect(wheelZooms("fit", 1, false)).toBe(true);
    expect(wheelZooms("width", 1, false)).toBe(false);
    expect(wheelZooms("original", 1, false)).toBe(false);
    expect(wheelZooms("width", 1, true)).toBe(true);
    expect(wheelZooms("width", 2, false)).toBe(true);
  });

  it("leaves vertical swipes to the page until the photo itself can move", () => {
    expect(touchAction("fit", 1, false)).toBe("pan-y");
    expect(touchAction("fit", 2, false)).toBe("none");
    expect(touchAction("cover", 1, false)).toBe("none");
    expect(touchAction("fit", 1, true)).toBe("none");
  });
});
