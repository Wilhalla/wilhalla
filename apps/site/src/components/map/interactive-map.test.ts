import { interactiveMapRegistry } from "@/config/registries";
import { describe, expect, it } from "vitest";
import {
  getSentinelExplanation,
  getSentinelLink,
  isExternalLink,
  linkedMapSentinels,
} from "./map-sentinels";

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

  it("links the birds in a new tab and Vakes appelboom to the blog archive", () => {
    expect(getSentinelLink("swallows")).toEqual({
      label: "CoZoeGo",
      newTab: true,
      to: "https://cozoego.be/",
    });
    expect(getSentinelLink("vake-tree")).toEqual({
      label: "Vakes appelboom",
      to: "https://fruit.wilhalla.be",
    });
    expect(isExternalLink("https://cozoego.be/")).toBe(true);
    expect(isExternalLink("https://fruit.wilhalla.be")).toBe(true);
  });

  it("leaves sentinels without a destination unlinked", () => {
    expect(getSentinelLink("caption-kippenhok")).toBeNull();
  });

  it("only links to existing site routes", () => {
    const knownRoutes = new Set([
      "/contact",
      "/over-ons",
      "/over-ons/samentuin",
      "/verhuur",
      "/welzijn",
      "/welzijn/paardencoaching",
    ]);
    const internalDestinations = linkedMapSentinels
      .map((sentinel) => sentinel.link.to)
      .filter((to) => to.startsWith("/"));

    expect(internalDestinations).not.toHaveLength(0);
    expect(internalDestinations.every((to) => knownRoutes.has(to))).toBe(true);
  });

  it("keeps the explanation object identity stable", () => {
    const first = getSentinelExplanation("garden");
    expect(first?.linkLabel).toBe("Samentuin");
    expect(getSentinelExplanation("garden")).toBe(first);
  });

  it("lists each destination once for assistive technology", () => {
    const destinations = linkedMapSentinels.map((sentinel) => sentinel.link.to);
    expect(new Set(destinations).size).toBe(destinations.length);
  });
});
