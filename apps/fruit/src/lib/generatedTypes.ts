/**
 * The shape of the JSON files under `/generated/`, defined once: the build scripts that write
 * them and the pages that read them import these types, and the schemas check a fetched file
 * against them.
 */
import { z } from "zod";

export const mapPoint = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  year: z.number().nullable(),
  month: z.number().nullable(),
  season: z.string(),
  /** The story's primary category. */
  topicId: z.string(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  postIds: z.array(z.string()).optional(),
  neighbors: z.array(z.string()).optional(),
  x: z.number(),
  y: z.number(),
  imageCount: z.number(),
  /** `null` or absent for a story without images. */
  image: z.string().nullish(),
  excerpt: z.string(),
});
export type MapPoint = z.infer<typeof mapPoint>;

export const archiveClientPost = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  isoDate: z.string(),
  imageCount: z.number(),
  reactionCount: z.number(),
  topicIds: z.array(z.string()),
  isSeries: z.boolean().optional(),
  seriesPostCount: z.number().optional(),
});
export type ArchiveClientPost = z.infer<typeof archiveClientPost>;

export const archiveClientTopic = z.object({
  id: z.string(),
  label: z.string(),
  generatedLabel: z.string(),
  postCount: z.number(),
});
export type ArchiveClientTopic = z.infer<typeof archiveClientTopic>;

export const archiveClientPayload = z.object({
  topics: z.array(archiveClientTopic),
  aggregated: z.array(archiveClientPost),
  all: z.array(archiveClientPost),
});
export type ArchiveClientPayload = z.infer<typeof archiveClientPayload>;

/** Category ids per post id. */
export const postCategoryIds = z.record(z.string(), z.array(z.string()));
export type PostCategoryIds = z.infer<typeof postCategoryIds>;

/** One photo of the image archive (`image-index*.json`). */
export const galleryImage = z.object({
  id: z.string(),
  src: z.string(),
  thumbSrc: z.string().optional(),
  postId: z.string().optional(),
  postSlug: z.string(),
  postTitle: z.string(),
  date: z.string(),
  isoDate: z.string().optional(),
  year: z.number().nullable(),
  month: z.number().nullable(),
  season: z.string(),
  excerpt: z.string(),
  caption: z.string(),
  visualDescription: z.string().optional(),
  imageSpecificText: z.array(z.string()).optional(),
  imageTagIds: z.array(z.string()).optional(),
  seriesId: z.string().nullish(),
  seriesTitle: z.string().nullish(),
  imageIndex: z.number().optional(),
  visualTags: z.array(z.string()),
  visualClusterId: z.string().optional(),
});
export type GalleryImageRecord = z.infer<typeof galleryImage>;

/** The year files that together hold the whole image index. */
export const galleryIndexManifest = z.object({
  imageCount: z.number(),
  chunks: z.array(z.object({ file: z.string(), imageCount: z.number() })).min(1),
});

const galleryGroup = z.object({ id: z.string(), label: z.string(), count: z.number() });
export const galleryGroups = z.object({
  years: z.array(galleryGroup),
  seasons: z.array(galleryGroup),
  themes: z.array(galleryGroup.extend({ icon: z.string() })),
});
export type GalleryGroups = z.infer<typeof galleryGroups>;

/** Species named near a photo; only the labels are used, for searching. */
export const speciesImageTags = z.array(
  z.object({
    imageId: z.string(),
    tags: z.array(z.object({ label: z.string(), candidateId: z.string() })),
  }),
);
export type SpeciesTag = z.infer<typeof speciesImageTags>[number]["tags"][number];

/** Ids of visually similar photos, per photo id. */
export const relatedImageIds = z.record(z.string(), z.array(z.string()));
export type RelatedImageIds = z.infer<typeof relatedImageIds>;

/** One block of a post in the full-text search index. */
export interface SearchDoc {
  id: string;
  postId: string;
  slug: string;
  url: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
  block: string;
  blockIndex: number;
  imageCount: number;
  topicId: string;
}

/** The fields of a `SearchDoc` that the index stores and returns with a hit. */
export const SEARCH_STORE_FIELDS = [
  "postId",
  "slug",
  "url",
  "title",
  "date",
  "isoDate",
  "excerpt",
  "block",
  "blockIndex",
  "imageCount",
  "topicId",
] as const satisfies readonly (keyof SearchDoc)[];

export const SEARCH_INDEX_FIELDS = [
  "title",
  "excerpt",
  "block",
] as const satisfies readonly (keyof SearchDoc)[];
export const SEARCH_FUZZY = 0.18;

export interface SearchChunkManifestEntry {
  id: string;
  year: string;
  file: string;
  postCount: number;
  blockCount: number;
}

export interface SearchCategory {
  id: string;
  label: string;
  postCount: number;
}
