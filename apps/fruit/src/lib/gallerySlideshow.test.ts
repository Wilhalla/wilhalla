import { describe, expect, it } from "vitest";
import {
  initialSlideTransition,
  initialSlideshowSettings,
  slideAt,
  slideTransitionReducer,
  slideshowOrder,
  slideshowReducer,
} from "./gallerySlideshow";
import { testImage } from "./galleryTestImages";

const day = (id: string, date: string) => testImage(id, { date, isoDate: `${date}T10:00:00` });
const first40 = Array.from({ length: 40 }, (_, index) =>
  day(`a${index}`, `2010-01-${String((index % 28) + 1).padStart(2, "0")}`),
);
const later = Array.from({ length: 60 }, (_, index) =>
  day(`b${index}`, `2011-02-${String((index % 28) + 1).padStart(2, "0")}`),
);
const ids = (list: readonly { id: string }[]) => list.map((image) => image.id);

describe("slideshow", () => {
  it("plays oldest first, with a stable order for photos of the same moment", () => {
    const order = slideshowOrder(
      [day("z", "2012-05-01"), day("b", "2009-05-01"), day("a", "2009-05-01")],
      initialSlideshowSettings,
    );

    expect(ids(order)).toEqual(["a", "b", "z"]);
  });

  it("takes in photos that load after it started, without reshuffling the ones it had", () => {
    for (const settings of [initialSlideshowSettings, { mode: "random", seed: 7 } as const]) {
      const before = ids(slideshowOrder(first40, settings));
      const after = ids(slideshowOrder([...first40, ...later], settings));

      expect(after).toHaveLength(100);
      expect(after.filter((id) => before.includes(id))).toEqual(before);
    }
  });

  it("shuffles differently for another seed, and the same for the same seed", () => {
    const one = ids(slideshowOrder(first40, { mode: "random", seed: 1 }));

    expect(ids(slideshowOrder(first40, { mode: "random", seed: 1 }))).toEqual(one);
    expect(ids(slideshowOrder(first40, { mode: "random", seed: 2 }))).not.toEqual(one);
    expect(one.toSorted()).toEqual(ids(first40).toSorted());
  });

  it("steps through the order in both directions, wrapping around", () => {
    const order = [day("a", "2009-01-01"), day("b", "2009-01-02"), day("c", "2009-01-03")];

    expect(slideAt(order, "a", 1)?.id).toBe("b");
    expect(slideAt(order, "c", 1)?.id).toBe("a");
    expect(slideAt(order, "a", -1)?.id).toBe("c");
    // A photo outside the selection starts the slideshow at its beginning.
    expect(slideAt(order, "elsewhere", 1)?.id).toBe("b");
    expect(slideAt([], "a", 1)).toBeUndefined();
  });

  it("changes order, pace and pause; a pace that is not offered is ignored", () => {
    const random = slideshowReducer(initialSlideshowSettings, {
      type: "mode",
      mode: "random",
      seed: 9,
    });

    expect(random).toMatchObject({ mode: "random", seed: 9 });
    expect(slideshowReducer(random, { type: "seconds", seconds: 12 }).seconds).toBe(12);
    expect(slideshowReducer(random, { type: "seconds", seconds: 0.01 })).toBe(random);
    expect(slideshowReducer(random, { type: "togglePaused" }).paused).toBe(true);
  });

  it("keeps the last slide that arrived on screen until the next one has arrived", () => {
    const shownA = slideTransitionReducer(initialSlideTransition, { type: "loaded", id: "a" });
    const leftA = slideTransitionReducer(shownA, { type: "leave", id: "a" });
    // "b" is slow and the visitor skips on before it arrives: "a" stays underneath.
    const leftB = slideTransitionReducer(leftA, { type: "leave", id: "b" });
    const shownC = slideTransitionReducer(leftB, { type: "loaded", id: "c" });

    expect(leftA).toEqual({ loadedId: "a", previousId: "a" });
    expect(leftB).toBe(leftA);
    expect(shownC).toEqual({ loadedId: "c", previousId: "a" });
    expect(slideTransitionReducer(shownC, { type: "faded" })).toEqual({
      loadedId: "c",
      previousId: null,
    });
  });
});
