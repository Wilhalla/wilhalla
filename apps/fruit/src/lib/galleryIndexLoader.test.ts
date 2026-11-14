import { afterEach, expect, it, vi } from "vitest";
import { loadGalleryIndexChunks } from "./galleryIndexLoader";
import type { GalleryImageRecord } from "./generatedTypes";
import { testImage } from "./galleryTestImages";

afterEach(() => vi.unstubAllGlobals());

function stubIndex(years: number, yearFile: (year: number) => unknown) {
  const requests = { active: 0, peak: 0 };
  vi.stubGlobal("fetch", async (url: string) => {
    if (url.endsWith("image-index-chunks.json")) {
      return Response.json({
        imageCount: years,
        chunks: Array.from({ length: years }, (_, year) => ({
          file: `year-${year}.json`,
          imageCount: 1,
        })),
      });
    }
    requests.active += 1;
    requests.peak = Math.max(requests.peak, requests.active);
    await new Promise((resolve) => setTimeout(resolve, 0));
    requests.active -= 1;
    return Response.json(yearFile(Number(url.match(/year-(\d+)/)?.[1])));
  });
  return requests;
}

it("loads the year files a few at a time and reports the growing list once per batch", async () => {
  const requests = stubIndex(5, (year) => [testImage(String(year), { caption: "from index" })]);
  const updates: GalleryImageRecord[][] = [];

  await loadGalleryIndexChunks({
    seed: [testImage("0", { caption: "from page" })],
    onBatch: (images) => updates.push(images),
    priority: "low",
  });

  expect(requests.peak).toBe(4);
  expect(updates).toHaveLength(2);
  expect(updates.at(-1)?.map((image) => image.id)).toEqual(["0", "1", "2", "3", "4"]);
  // The index replaces the photo the page was built with.
  expect(updates.at(-1)?.[0]?.caption).toBe("from index");
});

it("rejects a year file of the wrong shape instead of passing it on", async () => {
  stubIndex(1, () => [{ id: "broken" }]);

  await expect(
    loadGalleryIndexChunks({ seed: [], onBatch: () => undefined, priority: "low" }),
  ).rejects.toThrow("postSlug");
});
