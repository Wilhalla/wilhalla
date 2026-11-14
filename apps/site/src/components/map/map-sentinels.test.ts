import { describe, expect, it } from "vitest";
import {
  cardLabelSources,
  clampCardPosition,
  fallbackGlowRect,
  introSequence,
  introStepByImage,
  linkedSentinels,
  mapOverlayImages,
  mapStops,
  overlayImageSources,
  sentinelAt,
  visibleMapRect,
} from "./map-sentinels";

describe("map sentinels", () => {
  it("finds the most specific place under a point", () => {
    // Where the chicken coop and the garden overlap, the smaller area wins.
    expect(sentinelAt({ x: 2400, y: 1300 })).toBe("caption-kippenhok");
    expect(sentinelAt({ x: 2700, y: 1150 })).toBe("garden");
    expect(sentinelAt({ x: 100, y: 100 })).toBeNull();
  });

  it("uses the polygon of a place that has one instead of its rectangle", () => {
    // Inside the orchard's rectangle but cut out of its polygon (the yurt's corner).
    expect(sentinelAt({ x: 2900, y: 1700 })).not.toBe("caption-boomgaard-kleinfruit");
    expect(sentinelAt({ x: 3400, y: 1200 })).toBe("caption-boomgaard-kleinfruit");
  });

  it("lights up the painted overlay and captions of a place, each image once", () => {
    expect(overlayImageSources("caption-kippenhok")).toEqual([
      "/map-overlays/hover/kippenhok.webp",
      "/map-overlays/text/kippenhok.webp",
    ]);
    expect(overlayImageSources("yurt")).not.toContain(
      "/map-overlays/text/boomgaard-kleinfruit.webp",
    );
    expect(new Set(mapOverlayImages.map((image) => image.src)).size).toBe(mapOverlayImages.length);
  });

  it("derives card labels and the fallback glow from the same place data", () => {
    expect(cardLabelSources("caption-windroos")).toEqual([
      "/map-overlays/card-labels/zoerselbos.webp",
      "/map-overlays/card-labels/halle-dorp.webp",
    ]);
    expect(fallbackGlowRect("yurt")).toBeNull();
    expect(fallbackGlowRect("caption-bijen")).toEqual({
      minX: 3371,
      minY: 1373,
      maxX: 3615,
      maxY: 1629,
    });
  });

  it("orders the intro by map position, one step per image", () => {
    expect(introSequence.map((sentinel) => sentinel.id)).toEqual([
      "horses",
      "swallows",
      "vake-tree",
      "garden",
      "barn",
      "yurt",
    ]);
    expect(introStepByImage.get("/map-overlays/hover/horses.webp")).toBe(0);
    expect(introStepByImage.get("/map-overlays/text/yurt.webp")).toBe(5);
    expect(introStepByImage.has("/map-overlays/text/bijen.webp")).toBe(false);
    // An image shared by two steps could only animate once.
    expect(introStepByImage.size).toBe(
      introSequence.flatMap((sentinel) => overlayImageSources(sentinel.id)).length,
    );
  });

  it("lists the mobile stops and each destination once", () => {
    expect(mapStops.map((stop) => stop.label)).toEqual([
      "De paarden",
      "De zwaluwen",
      "Vakes appelboom",
      "De samentuin",
      "De schuur",
      "De yurt",
      "Ligging",
    ]);
    expect(linkedSentinels.map((sentinel) => sentinel.link.label)).toEqual([
      "Paardencoaching",
      "Schuur",
      "Vakes appelboom",
      "Samentuin",
      "Welzijn in de yurt",
      "CoZoeGo",
    ]);
  });

  it("knows which part of the cropped, enlarged map is on screen", () => {
    // A screen with the map's own proportions shows 1/1.2 of it: centred, from the top edge.
    const rect = visibleMapRect({ width: 2000, height: 1168.5 }, 1.2);

    expect(rect.minX).toBeCloseTo(4000 / 12);
    expect(rect.maxX).toBeCloseTo(4000 - 4000 / 12);
    expect(rect.minY).toBeCloseTo(0);
    expect(rect.maxY).toBeCloseTo(2337 / 1.2);
    // A narrow screen crops the sides.
    expect(visibleMapRect({ width: 1000, height: 1168.5 }, 1).minX).toBeCloseTo(1000);
  });

  it("clamps a card into the visible part and centres one that cannot fit", () => {
    expect(clampCardPosition(10, 100, [0, 400])).toBe(64);
    expect(clampCardPosition(390, 100, [0, 400])).toBe(236);
    expect(clampCardPosition(150, 100, [0, 400])).toBe(150);
    expect(clampCardPosition(10, 380, [0, 400])).toBe(10);
  });
});
