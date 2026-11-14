import type { GalleryImageRecord } from "./generatedTypes";

/** A photo for tests: only what the test cares about is given. */
export function testImage(
  id: string,
  fields: Partial<GalleryImageRecord> = {},
): GalleryImageRecord {
  return {
    id,
    src: `/archive-images/${id}.jpg`,
    postSlug: id,
    postTitle: `Post ${id}`,
    date: "2008-03-07",
    year: 2008,
    month: 3,
    season: "lente",
    excerpt: "",
    caption: "",
    visualTags: [],
    ...fields,
  };
}
