import { describe, expect, it } from "vitest";
import { galleryIndexReducer, type GalleryIndex } from "./galleryIndex";
import { testImage } from "./galleryTestImages";

const seed: GalleryIndex = { status: "seed", images: [testImage("a")] };
const more = [testImage("a"), testImage("b")];

describe("gallery index", () => {
  it("grows while loading and ends ready", () => {
    const loading = galleryIndexReducer(seed, { type: "started" });
    const grown = galleryIndexReducer(loading, { type: "batch", images: more });

    expect(loading).toEqual({ status: "loading", images: seed.images });
    expect(grown.images).toBe(more);
    expect(galleryIndexReducer(grown, { type: "completed" })).toEqual({
      status: "ready",
      images: more,
    });
  });

  it("ends in an error that keeps the photos it has and its reason, never in endless loading", () => {
    const loading = galleryIndexReducer(seed, { type: "started" });
    const failed = galleryIndexReducer(
      galleryIndexReducer(loading, { type: "batch", images: more }),
      { type: "failed", message: "503" },
    );

    expect(failed).toEqual({ status: "error", images: more, message: "503" });
    // A retry starts loading again from what there is.
    expect(galleryIndexReducer(failed, { type: "started" })).toEqual({
      status: "loading",
      images: more,
    });
  });

  it("ignores what arrives outside a load and never reloads a complete index", () => {
    const ready: GalleryIndex = { status: "ready", images: more };

    expect(galleryIndexReducer(seed, { type: "batch", images: more })).toBe(seed);
    expect(galleryIndexReducer(seed, { type: "failed", message: "x" })).toBe(seed);
    expect(galleryIndexReducer(ready, { type: "started" })).toBe(ready);
  });
});
