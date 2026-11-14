import { describe, expect, it } from "vitest";
import type { GalleryIndex } from "./galleryIndex";
import { testImage } from "./galleryTestImages";
import { galleryExit, viewerKeyAction, viewerView } from "./galleryViewer";

const images = [testImage("a")];
const at = (index: GalleryIndex, imageId: string | null, slideshow = false) =>
  viewerView({ hydrated: true, imageId, index, slideshow });
const press = (key: string, overrides = {}) =>
  viewerKeyAction({
    key,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    defaultPrevented: false,
    consumed: false,
    ...overrides,
  });

describe("gallery viewer", () => {
  it("shows the photo as soon as it is known, as viewer or slideshow", () => {
    expect(at({ status: "seed", images }, "a")).toEqual({ kind: "image", image: images[0] });
    expect(at({ status: "loading", images }, "a", true)).toEqual({
      kind: "slideshow",
      image: images[0],
    });
  });

  it("is loading only while the index can still bring the photo", () => {
    expect(at({ status: "seed", images }, "b")).toEqual({ kind: "loading", slideshow: false });
    expect(at({ status: "loading", images }, "b", true)).toEqual({
      kind: "loading",
      slideshow: true,
    });
    expect(at({ status: "ready", images }, "b")).toEqual({ kind: "notFound" });
    // A failed index is an error with its reason, not an endless blank page.
    expect(at({ status: "error", images, message: "503" }, "b")).toEqual({
      kind: "failed",
      message: "503",
    });
    expect(at({ status: "error", images, message: "503" }, "a").kind).toBe("image");
  });

  it("knows nothing before hydration and asks for a photo when the URL has none", () => {
    expect(
      viewerView({
        hydrated: false,
        imageId: "a",
        index: { status: "seed", images },
        slideshow: false,
      }),
    ).toEqual({ kind: "hydrating" });
    expect(at({ status: "seed", images }, null)).toEqual({ kind: "noImage" });
  });

  it("maps the arrow keys and Escape, and leaves keys that belong to something else alone", () => {
    expect(press("ArrowLeft")).toBe("previous");
    expect(press("ArrowRight")).toBe("next");
    expect(press("Escape")).toBe("exit");
    expect(press("a")).toBeNull();
    // Alt+Left is the browser's "back"; a slider or an open menu uses the keys itself.
    expect(press("ArrowLeft", { altKey: true })).toBeNull();
    expect(press("ArrowRight", { metaKey: true })).toBeNull();
    expect(press("ArrowRight", { consumed: true })).toBeNull();
    expect(press("Escape", { defaultPrevented: true })).toBeNull();
  });

  it("goes back through history only when the visitor came from the archive grid", () => {
    const origin = "https://fruit.example";

    expect(galleryExit(`${origin}/gallery/?year=2010`, origin)).toBe("back");
    expect(galleryExit(`${origin}/posts/fruit2-1/`, origin)).toBe("open");
    expect(galleryExit(`${origin}/gallery/view/?img=x`, origin)).toBe("open");
    expect(galleryExit("https://elsewhere.example/gallery/", origin)).toBe("open");
    expect(galleryExit("", origin)).toBe("open");
  });
});
