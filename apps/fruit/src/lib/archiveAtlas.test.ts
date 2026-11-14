import { describe, expect, it } from "vitest";
import {
  NO_ATLAS_FILTERS,
  atlasUrlCodec,
  atlasYears,
  categoryColor,
  colorMix,
  filterAtlasPoints,
  findAtlasPoint,
  relatedAtlasPointIds,
  type MapPoint,
} from "./archiveAtlas";
import { searchWithState } from "./urlState";

const point = (id: string, fields: Partial<MapPoint>): MapPoint => ({
  id,
  slug: `slug-${id}`,
  title: id,
  date: "2008-01-01",
  year: 2008,
  month: 1,
  season: "winter",
  topicId: "fruit",
  x: 0.5,
  y: 0.5,
  imageCount: 0,
  excerpt: "",
  ...fields,
});

const points = [
  point("a", { title: "Appel", categoryIds: ["fruit", "natuur"], neighbors: ["c"], imageCount: 1 }),
  point("b", { title: "Peer", year: 2007, excerpt: "fruit", x: 0.25, y: 0.35 }),
  point("c", { title: "Vogel", year: 2007, topicId: "natuur", season: "lente", x: 0.8, y: 0.7 }),
];
const ids = (list: readonly MapPoint[]) => list.map((item) => item.id);

describe("archive atlas", () => {
  it("filters stories on category, year, season, images and text", () => {
    expect(ids(filterAtlasPoints(points, NO_ATLAS_FILTERS))).toEqual(["a", "b", "c"]);
    expect(ids(filterAtlasPoints(points, { ...NO_ATLAS_FILTERS, category: "natuur" }))).toEqual([
      "a",
      "c",
    ]);
    expect(ids(filterAtlasPoints(points, { ...NO_ATLAS_FILTERS, year: 2007 }))).toEqual(["b", "c"]);
    expect(ids(filterAtlasPoints(points, { ...NO_ATLAS_FILTERS, season: "lente" }))).toEqual(["c"]);
    expect(ids(filterAtlasPoints(points, { ...NO_ATLAS_FILTERS, imagesOnly: true }))).toEqual([
      "a",
    ]);
    expect(ids(filterAtlasPoints(points, { ...NO_ATLAS_FILTERS, search: " FRUIT " }))).toEqual([
      "b",
    ]);
  });

  it("lists years newest first and finds a story by slug or id", () => {
    expect(atlasYears(points)).toEqual([2008, 2007]);
    expect(findAtlasPoint(points, "slug-b")?.id).toBe("b");
    expect(findAtlasPoint(points, "c")?.id).toBe("c");
    expect(findAtlasPoint(points, "nope")).toBeNull();
  });

  it("relates a story to its listed neighbours, else to the nearest on the map", () => {
    expect(relatedAtlasPointIds(points, points[0])).toEqual(["c"]);
    expect(relatedAtlasPointIds(points, points[1])).toEqual(["a", "c"]);
  });

  it("round-trips the URL and still reads the older topic links", () => {
    const state = {
      filters: {
        category: "fruit",
        year: 2008,
        season: "winter" as const,
        imagesOnly: true,
        search: "boom ",
      },
      point: "slug-a",
      arrangement: "meaning" as const,
    };
    const search = searchWithState(atlasUrlCodec, state, "?topic=reizen&cluster=x");
    expect(search).toBe(
      "?category=fruit&year=2008&season=winter&images=1&q=boom+&point=slug-a&view=meaning",
    );
    expect(atlasUrlCodec.parse(new URLSearchParams(search))).toEqual(state);

    const legacy = atlasUrlCodec.parse(new URLSearchParams("?topic=reizen&year=08&season=x"));
    expect(legacy.filters).toEqual({ ...NO_ATLAS_FILTERS, category: "reizen" });
    expect(legacy.arrangement).toBe("subject");
    expect(
      atlasUrlCodec.parse(new URLSearchParams("?category=onbekend")).filters.category,
    ).toBeNull();
  });

  it("colours a category and converts hex colours for the canvas", () => {
    expect(categoryColor("fruit")).toBe("--color-topic-fruit");
    expect(categoryColor("onbekend")).toBe(categoryColor("overig"));
    expect(colorMix("#ff0000", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
    expect(colorMix("red", 0.5)).toBe("red");
  });
});
