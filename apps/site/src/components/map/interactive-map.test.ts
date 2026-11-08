import { interactiveMapRegistry } from "@/config/registries";
import { describe, expect, it } from "vitest";
import { getSentinelExplanation, getSentinelLink, mapSentinels } from "./map-sentinels";

describe("Interactive Map registry", () => {
  it("keeps responsive image assets behind the Interactive Map registry seam", () => {
    expect(interactiveMapRegistry.assets.desktopWebpSrc).toBe("/wilhalla_map-4000.webp");
    expect(interactiveMapRegistry.desktopMediaQuery).toBe("(min-width: 1024px)");
    expect(interactiveMapRegistry.sceneSizes).toBe("171vh");
  });
});

describe("Interactive Map links", () => {
  it("links the horses sentinel to paardencoaching", () => {
    expect(getSentinelLink("horses")).toEqual({
      label: "Paardencoaching",
      to: "/welzijn/paardencoaching",
    });
  });

  it("leaves sentinels without a destination unlinked", () => {
    expect(getSentinelLink("swallows")).toBeNull();
  });

  it("only links to existing site routes", () => {
    const knownRoutes = new Set([
      "/contact", "/over-ons", "/over-ons/samentuin",
      "/verhuur", "/welzijn", "/welzijn/paardencoaching",
    ]);
    for (const sentinel of mapSentinels) {
      if (sentinel.link) expect(knownRoutes.has(sentinel.link.to)).toBe(true);
    }
  });

  it("keeps the explanation object identity stable", () => {
    const first = getSentinelExplanation("garden");
    expect(first?.linkLabel).toBe("Samentuin");
    expect(getSentinelExplanation("garden")).toBe(first);
  });
});
