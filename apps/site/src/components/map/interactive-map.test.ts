import { interactiveMapRegistry } from "@/config/registries";
import { describe, expect, it } from "vitest";

describe("Interactive Map registry", () => {
  it("keeps responsive image assets behind the Interactive Map registry seam", () => {
    expect(interactiveMapRegistry.assets.desktopWebpSrc).toBe(
      "/wilhalla_map-4000.webp",
    );
    expect(interactiveMapRegistry.desktopMediaQuery).toBe(
      "(min-width: 1024px)",
    );
    expect(interactiveMapRegistry.sceneSizes).toBe("171vh");
  });
});
