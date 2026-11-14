import { buildArchiveChronology } from "./archiveDateTime";
import { archiveAssetUrl, archiveSmallThumbUrl } from "./assetUrls";
import type { GalleryFilters } from "./galleryFilters";
import type { GalleryImageRecord, RelatedImageIds, SpeciesTag } from "./generatedTypes";

export type { GalleryGroups, GalleryImageRecord, SpeciesTag } from "./generatedTypes";

/** Species per photo id; empty until the species file is loaded. */
export type SpeciesByImage = ReadonlyMap<string, readonly SpeciesTag[]>;

export type GalleryRow =
  | { type: "year"; key: string; year: string }
  | { type: "month"; key: string; year: string; label: string; count: number }
  /** `offset` is the position of the row's first photo in the filtered list. */
  | { type: "images"; key: string; year: string; images: GalleryImageRecord[]; offset: number };

/** The first photos load before the rest: this many at high priority, this many eagerly. */
export const HIGH_PRIORITY_THUMBNAILS = 6;
export const EAGER_THUMBNAILS = 12;

const plantImageTagIds = new Set([
  "fruit",
  "appels",
  "peren",
  "ander_fruit",
  "groenten",
  "bloemen",
  "bomen",
  "tuinplanten",
  "tuinwerk",
  "plantschade",
]);
const plantVisualTags = ["tuin", "tuinwerk", "fruit", "bloemen", "planten", "teelt"];

const imageDateFormatter = new Intl.DateTimeFormat("nl-BE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function imageThumbSrc(image: Pick<GalleryImageRecord, "src">) {
  return archiveSmallThumbUrl(image.src);
}

export function imageFullSrc(image: Pick<GalleryImageRecord, "src">) {
  return archiveAssetUrl(image.src);
}

/** What the author wrote with a photo, if anything: the words to show a reader. */
export function imageCaption(image: Pick<GalleryImageRecord, "imageSpecificText">) {
  return (image.imageSpecificText ?? []).join(" · ");
}

/** Alt text describes what is in the photo, so the machine description comes first here. */
export function imageAlt(
  image: Pick<GalleryImageRecord, "visualDescription" | "caption" | "postTitle">,
) {
  return image.visualDescription || image.caption || image.postTitle;
}

/** "07 maart 2008 · 14:30"; the time is left out when the post has none. */
export function formatImagePostDateTime(image: Pick<GalleryImageRecord, "date" | "isoDate">) {
  const date = new Date(image.isoDate || image.date);
  const dateLabel = Number.isNaN(date.valueOf())
    ? image.isoDate || image.date
    : imageDateFormatter.format(date);
  const time = image.isoDate?.match(/T(\d{2}:\d{2})/)?.[1];
  return time && time !== "00:00" ? `${dateLabel} · ${time}` : dateLabel;
}

export function imageDownloadFilename(image: Pick<GalleryImageRecord, "id" | "src">) {
  const filename = image.src.split(/[?#]/)[0]?.split("/").findLast(Boolean);
  return filename ? decodeURIComponent(filename) : `${image.id}.jpg`;
}

export function imageShowsPeople(image: Pick<GalleryImageRecord, "imageTagIds" | "visualTags">) {
  return image.imageTagIds
    ? image.imageTagIds.includes("mensen")
    : image.visualTags.some((tag) => tag === "mensen" || tag === "familie");
}

export function imageShowsPlants(image: Pick<GalleryImageRecord, "imageTagIds" | "visualTags">) {
  return image.imageTagIds
    ? image.imageTagIds.some((tag) => plantImageTagIds.has(tag))
    : image.visualTags.some((tag) => plantVisualTags.includes(tag));
}

const imageTimes = new WeakMap<GalleryImageRecord, number>();

/** The photo's date as a number; parsed once per photo, the list is sorted on every filter change. */
function imageTime(image: GalleryImageRecord) {
  const known = imageTimes.get(image);
  if (known !== undefined) return known;
  const time = Date.parse(image.date);
  imageTimes.set(image, time);
  return time;
}

function searchText(image: GalleryImageRecord, species: readonly SpeciesTag[]) {
  return [
    image.postTitle,
    image.seriesTitle ?? "",
    image.caption,
    image.visualDescription ?? "",
    ...(image.imageSpecificText ?? []),
    image.excerpt,
    ...image.visualTags,
    ...(image.imageTagIds ?? []),
    ...species.map((tag) => tag.label),
  ]
    .join(" ")
    .toLowerCase();
}

/** The photos that pass the filters, in the chosen date order. */
export function filterGalleryImages(
  images: readonly GalleryImageRecord[],
  filters: GalleryFilters,
  speciesByImage: SpeciesByImage,
) {
  const query = filters.query.trim().toLowerCase();
  const direction = filters.sortNewest ? -1 : 1;
  return images
    .filter((image) => {
      const species = speciesByImage.get(image.id) ?? [];
      return (
        (!filters.year || String(image.year) === filters.year) &&
        (!filters.season || image.season === filters.season) &&
        (!filters.theme || image.visualTags.includes(filters.theme)) &&
        (!filters.species || species.some((tag) => tag.candidateId === filters.species)) &&
        (!query || searchText(image, species).includes(query))
      );
    })
    .toSorted((a, b) => direction * (imageTime(a) - imageTime(b)));
}

/** The filtered photos as the rows of the grid: a heading per year and month, then `columns` photos per row. */
export function buildGalleryRows(
  filtered: readonly GalleryImageRecord[],
  columns: number,
): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let offset = 0;
  for (const month of buildArchiveChronology(filtered, { sort: false }).monthGroups) {
    const year = month.year === "ongedateerd" ? "unknown" : month.year;
    const key = month.key.replace(/^m-/, "");
    if (month.startsYear) rows.push({ type: "year", key: `year-${year}`, year });
    rows.push({
      type: "month",
      key: `month-${key}`,
      year,
      label: month.label,
      count: month.items.length,
    });
    for (let index = 0; index < month.items.length; index += columns) {
      rows.push({
        type: "images",
        key: `images-${key}-${index}`,
        year,
        images: month.items.slice(index, index + columns),
        offset: offset + index,
      });
    }
    offset += month.items.length;
  }
  return rows;
}

/** The photo with `imageId` among the filtered ones, with its neighbours; -1 when it is filtered out. */
export function locateGalleryImage(filtered: readonly GalleryImageRecord[], imageId: string) {
  const index = filtered.findIndex((image) => image.id === imageId);
  return {
    index,
    previous: index > 0 ? filtered[index - 1] : undefined,
    next: index >= 0 ? filtered[index + 1] : undefined,
  };
}

/** Photos that look like `image`: the precomputed neighbours first, then others of its cluster. */
export function relatedGalleryImages(
  image: GalleryImageRecord,
  images: readonly GalleryImageRecord[],
  related: RelatedImageIds,
  limit = 10,
) {
  const byId = new Map(images.map((item) => [item.id, item]));
  const direct = (related[image.id] ?? []).flatMap((id) => byId.get(id) ?? []);
  const cluster = images.filter(
    (item) => item.visualClusterId && item.visualClusterId === image.visualClusterId,
  );
  return [...new Set([...direct, ...cluster])]
    .filter((item) => item.id !== image.id)
    .slice(0, limit);
}

/** Species labels are only searched from three characters on, and the species filter needs them too. */
export function needsSpeciesTags(filters: Pick<GalleryFilters, "query" | "species">) {
  return filters.species !== null || filters.query.trim().length >= 3;
}
