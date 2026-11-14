import { describe, expect, it } from "vitest";
import {
  defaultGalleryFilters,
  galleryHref,
  galleryUrlCodec,
  hasActiveGalleryFilters,
} from "./galleryFilters";

const parse = (search: string) => galleryUrlCodec.parse(new URLSearchParams(search));

describe("gallery URL state", () => {
  it("reads the filters and the photo, falling back to no filter for anything it does not know", () => {
    expect(parse("")).toEqual({ ...defaultGalleryFilters, imageId: null });
    expect(
      parse("?q=peer&theme=fruit&species=pear&year=2007&season=herfst&sort=old&img=img-1"),
    ).toEqual({
      query: "peer",
      theme: "fruit",
      species: "pear",
      year: "2007",
      season: "herfst",
      sortNewest: false,
      imageId: "img-1",
    });
    expect(parse("?season=monsoon&theme=all&image=img-2")).toEqual({
      ...defaultGalleryFilters,
      imageId: "img-2",
    });
  });

  it("round-trips through a link and leaves defaults out of it", () => {
    const state = { ...defaultGalleryFilters, query: "rode appel", year: "2010", imageId: "img-9" };
    const href = galleryHref("viewer", state);

    expect(href).toBe("/gallery/view/?q=rode+appel&year=2010&img=img-9");
    expect(parse(href.slice(href.indexOf("?")))).toEqual(state);
    expect(galleryHref("slideshow", state)).toBe(
      "/gallery/slideshow/?q=rode+appel&year=2010&img=img-9",
    );
    // The grid never carries a photo: that would send it straight back to the viewer.
    expect(galleryHref("grid", state)).toBe("/gallery/?q=rode+appel&year=2010");
    expect(galleryHref("grid", { ...defaultGalleryFilters, imageId: null })).toBe("/gallery/");
  });

  it("replaces the legacy photo parameter instead of keeping both", () => {
    const params = new URLSearchParams("?image=old&other=1");
    galleryUrlCodec.write({ ...defaultGalleryFilters, imageId: "new" }, params);

    expect(params.toString()).toBe("other=1&img=new");
  });

  it("knows when anything narrows or reorders the archive", () => {
    expect(hasActiveGalleryFilters(defaultGalleryFilters)).toBe(false);
    expect(hasActiveGalleryFilters({ ...defaultGalleryFilters, query: "  " })).toBe(false);
    expect(hasActiveGalleryFilters({ ...defaultGalleryFilters, season: "winter" })).toBe(true);
    expect(hasActiveGalleryFilters({ ...defaultGalleryFilters, sortNewest: false })).toBe(true);
  });
});
