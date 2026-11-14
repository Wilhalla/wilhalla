import { describe, expect, it } from "vitest";
import { defaultGalleryFilters } from "./galleryFilters";
import { testImage } from "./galleryTestImages";
import {
  buildGalleryRows,
  filterGalleryImages,
  formatImagePostDateTime,
  imageDownloadFilename,
  imageShowsPeople,
  imageShowsPlants,
  locateGalleryImage,
  needsSpeciesTags,
  relatedGalleryImages,
} from "./imageGallerySession";

const images = [
  testImage("a", {
    postTitle: "Apple blossom",
    date: "2008-03-07",
    caption: "bloesem",
    visualTags: ["fruit", "bloemen"],
    visualClusterId: "c1",
  }),
  testImage("b", {
    postTitle: "Pear harvest",
    date: "2007-09-02",
    year: 2007,
    month: 9,
    season: "herfst",
    visualTags: ["fruit"],
    visualClusterId: "c1",
  }),
  testImage("c", {
    postTitle: "Visitors",
    date: "2007-09-03",
    year: 2007,
    month: 9,
    season: "herfst",
    visualTags: ["mensen"],
    visualClusterId: "c2",
  }),
];
const noSpecies = new Map();
const ids = (list: readonly { id: string }[]) => list.map((image) => image.id);

describe("image gallery", () => {
  it("counts pictured people and plants from the fine image tags when there are any", () => {
    expect(imageShowsPeople({ imageTagIds: ["mensen"], visualTags: [] })).toBe(true);
    expect(imageShowsPeople({ imageTagIds: [], visualTags: ["mensen"] })).toBe(false);
    expect(imageShowsPeople({ visualTags: ["familie"] })).toBe(true);
    expect(imageShowsPlants({ imageTagIds: ["appels"], visualTags: [] })).toBe(true);
    expect(imageShowsPlants({ visualTags: ["landschap"] })).toBe(false);
  });

  it("filters by year, season, theme and text, newest first unless asked otherwise", () => {
    expect(ids(filterGalleryImages(images, defaultGalleryFilters, noSpecies))).toEqual([
      "a",
      "c",
      "b",
    ]);
    expect(
      ids(filterGalleryImages(images, { ...defaultGalleryFilters, sortNewest: false }, noSpecies)),
    ).toEqual(["b", "c", "a"]);
    expect(
      ids(
        filterGalleryImages(
          images,
          { ...defaultGalleryFilters, year: "2007", theme: "fruit" },
          noSpecies,
        ),
      ),
    ).toEqual(["b"]);
    expect(
      ids(
        filterGalleryImages(
          images,
          { ...defaultGalleryFilters, season: "herfst", query: " VISIT " },
          noSpecies,
        ),
      ),
    ).toEqual(["c"]);
  });

  it("searches species names and filters on a species once the names are loaded", () => {
    const species = new Map([["b", [{ label: "Conference peer", candidateId: "pear" }]]]);

    expect(
      ids(
        filterGalleryImages(images, { ...defaultGalleryFilters, query: "conference" }, noSpecies),
      ),
    ).toEqual([]);
    expect(
      ids(filterGalleryImages(images, { ...defaultGalleryFilters, query: "conference" }, species)),
    ).toEqual(["b"]);
    expect(
      ids(filterGalleryImages(images, { ...defaultGalleryFilters, species: "pear" }, species)),
    ).toEqual(["b"]);
    expect(needsSpeciesTags({ query: "pe", species: null })).toBe(false);
    expect(needsSpeciesTags({ query: "per", species: null })).toBe(true);
    expect(needsSpeciesTags({ query: "", species: "pear" })).toBe(true);
  });

  it("lays the photos out in rows per year and month, each row knowing where it starts", () => {
    const rows = buildGalleryRows(filterGalleryImages(images, defaultGalleryFilters, noSpecies), 1);

    expect(rows.map((row) => `${row.type}:${row.year}`)).toEqual([
      "year:2008",
      "month:2008",
      "images:2008",
      "year:2007",
      "month:2007",
      "images:2007",
      "images:2007",
    ]);
    expect(rows.flatMap((row) => (row.type === "images" ? [row.offset] : []))).toEqual([0, 1, 2]);
    expect(buildGalleryRows(images, 5).filter((row) => row.type === "images")).toHaveLength(2);
  });

  it("finds a photo and its neighbours in the selection", () => {
    const selection = filterGalleryImages(images, defaultGalleryFilters, noSpecies);

    expect(locateGalleryImage(selection, "c")).toMatchObject({
      index: 1,
      previous: { id: "a" },
      next: { id: "b" },
    });
    expect(locateGalleryImage(selection, "a").previous).toBeUndefined();
    expect(locateGalleryImage(selection, "b").next).toBeUndefined();
    expect(locateGalleryImage(selection, "zzz")).toEqual({
      index: -1,
      previous: undefined,
      next: undefined,
    });
  });

  it("lists similar photos: the precomputed ones first, then the rest of the cluster, never itself", () => {
    expect(ids(relatedGalleryImages(images[0], images, { a: ["c", "a", "missing"] }))).toEqual([
      "c",
      "b",
    ]);
    expect(ids(relatedGalleryImages(images[2], images, {}))).toEqual([]);
  });

  it("labels and names a photo", () => {
    expect(formatImagePostDateTime({ date: "2008-03-07", isoDate: "2008-03-07T14:30:00" })).toBe(
      "07 maart 2008 · 14:30",
    );
    expect(formatImagePostDateTime({ date: "2008-03-07", isoDate: "2008-03-07T00:00:00" })).toBe(
      "07 maart 2008",
    );
    expect(formatImagePostDateTime({ date: "ooit" })).toBe("ooit");
    expect(imageDownloadFilename({ id: "a", src: "/archive-images/x/foto%201.jpg?v=2" })).toBe(
      "foto 1.jpg",
    );
    expect(imageDownloadFilename({ id: "a", src: "" })).toBe("a.jpg");
  });
});
