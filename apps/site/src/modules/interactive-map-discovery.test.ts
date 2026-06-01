import { describe, expect, it } from "vitest";
import {
  allMapHoverImages,
  getActiveMapDiscovery,
  getAdjustedExplanationPosition,
  getCardLabelImageSrc,
  getMapOverlayTransitionDurationMs,
  hasDarkInkCardLabel,
  introMapSequence,
  isTextOverlayImage,
} from "./interactive-map-discovery";

describe("Interactive Map discovery", () => {
  it("builds one deduplicated hover image registry", () => {
    expect(allMapHoverImages).toContain("/map-overlays/hover/horses.webp");
    expect(new Set(allMapHoverImages).size).toBe(allMapHoverImages.length);
  });

  it("orders the intro sequence by map position and skips opt-out sentinels", () => {
    expect(introMapSequence.map((sentinel) => sentinel.id)).toEqual([
      "horses",
      "swallows",
      "vake-tree",
      "garden",
      "barn",
      "yurt",
    ]);
  });

  it("creates discovery state from hover before intro fallback", () => {
    const discovery = getActiveMapDiscovery({
      hoveredSentinelId: "yurt",
      introActiveSentinelId: "horses",
    });

    expect(discovery.activeHoverImages).toEqual(
      expect.arrayContaining([
        "/map-overlays/hover/yurt.webp",
        "/map-overlays/text/yurt.webp",
      ]),
    );
    expect(discovery.activeLabelImages).toEqual([
      "/map-overlays/card-labels/yurt.webp",
    ]);
    expect(discovery.activeExplanation).toMatchObject({
      text: expect.stringContaining("yurt"),
    });
  });

  it("uses intro hover images when nothing is hovered", () => {
    expect(
      getActiveMapDiscovery({
        hoveredSentinelId: null,
        introActiveSentinelId: "garden",
      }).activeHoverImages,
    ).toContain("/map-overlays/hover/garden.webp");
  });

  it("keeps label-image and transition rules behind the module seam", () => {
    expect(isTextOverlayImage("/map-overlays/text/horses.webp")).toBe(true);
    expect(getCardLabelImageSrc("/map-overlays/text/yurt.webp")).toBe(
      "/map-overlays/card-labels/yurt.webp",
    );
    expect(hasDarkInkCardLabel("/map-overlays/card-labels/horses.webp")).toBe(
      true,
    );
    expect(
      getMapOverlayTransitionDurationMs({
        introDismissed: false,
        introOverlayTransitionMs: 123,
        onboardingVisible: true,
      }),
    ).toBe(123);
  });

  it("clamps explanation cards to the visible viewBox", () => {
    expect(
      getAdjustedExplanationPosition({
        explanation: { text: "test", x: 10, y: 10, width: 100, height: 50 },
        visibleViewBoxRect: { minX: 0, minY: 0, maxX: 400, maxY: 300 },
      }),
    ).toMatchObject({ x: 64, y: 64, width: 100, height: 50 });
  });
});
