import { describe, expect, it } from "vitest";
import { initialMapState, mapReducer } from "./map-state";

const idle = initialMapState(false);

describe("map state", () => {
  it("ends the intro when the visitor first points at a place, not when the pointer is elsewhere", () => {
    const introducing = initialMapState(true);

    expect(mapReducer(introducing, { type: "hover", id: null }).introducing).toBe(true);
    expect(mapReducer(introducing, { type: "hover", id: "yurt" }).introducing).toBe(false);
    expect(mapReducer(introducing, { type: "tap", id: "yurt" }).introducing).toBe(false);
  });

  it("keeps the same state object while the pointer stays on one place", () => {
    const hovering = mapReducer(idle, { type: "hover", id: "garden" });

    expect(mapReducer(hovering, { type: "hover", id: "garden" })).toBe(hovering);
  });

  it("remembers the last explained place so its card can fade out", () => {
    const onYurt = mapReducer(idle, { type: "hover", id: "yurt" });
    const onSwallows = mapReducer(onYurt, { type: "hover", id: "swallows" });
    const away = mapReducer(onSwallows, { type: "hover", id: null });

    expect(onYurt.card).toBe("yurt");
    // The swallows have no explanation.
    expect(onSwallows.card).toBe("yurt");
    expect(away).toMatchObject({ hovered: null, card: "yurt" });
  });

  it("offers the link of a tapped place and clears on a tap beside every place", () => {
    const tapped = mapReducer(idle, { type: "tap", id: "barn" });

    expect(tapped.stop).toEqual({ id: "barn", sheet: true });
    expect(mapReducer(tapped, { type: "tap", id: null }).stop).toBeNull();
    expect(mapReducer(tapped, { type: "closeSheet" }).stop).toBeNull();
  });

  it("walks the stops in both directions, wrapping around, without the link sheet", () => {
    const first = mapReducer(idle, { type: "step", direction: 1 });
    const last = mapReducer(idle, { type: "step", direction: -1 });

    expect(first.stop).toEqual({ id: "horses", sheet: false });
    expect(last.stop).toEqual({ id: "caption-windroos", sheet: false });
    expect(mapReducer(last, { type: "step", direction: 1 }).stop?.id).toBe("horses");
    expect(mapReducer(first, { type: "step", direction: -1 }).stop?.id).toBe("caption-windroos");
    expect(mapReducer(first, { type: "step", direction: 1 }).stop?.id).toBe("swallows");
    expect(mapReducer(first, { type: "choose", id: "yurt" }).stop).toEqual({
      id: "yurt",
      sheet: false,
    });
  });
});
