import { isSeason, type Season } from "./archiveDateTime";
import type { MapPoint } from "./generatedTypes";
import { setParam, type UrlCodec } from "./urlState";

export type { MapPoint };
export interface ScreenPoint {
  x: number;
  y: number;
}

/**
 * The subjects of the archive: one definition of each one's name, description and colour. The
 * colour is the name of a theme token (`--color-topic-*` in @wilhalla/ui/tokens.css): CSS reads it
 * as `var(…)`, the atlas canvas resolves it from the page's styles.
 */
export const atlasCategories = [
  {
    id: "fruit",
    label: "Fruit & rassen",
    description: "Fruitsoorten, rassen, bloei en oogst.",
    color: "--color-topic-fruit",
  },
  {
    id: "teelt",
    label: "Tuin & teelt",
    description: "Tuinwerk, bodem, enten en teelt.",
    color: "--color-topic-teelt",
  },
  {
    id: "plantgezondheid",
    label: "Plantenproblemen",
    description: "Schade, ziekten en plagen.",
    color: "--color-topic-plantgezondheid",
  },
  {
    id: "natuur",
    label: "Natuur & seizoenen",
    description: "Weer, vogels, insecten en tuinleven.",
    color: "--color-topic-natuur",
  },
  {
    id: "reizen",
    label: "Reizen & bezoeken",
    description: "Uitstappen, tuinen en evenementen.",
    color: "--color-topic-reizen",
  },
  {
    id: "erfgoed",
    label: "Erfgoed & verhalen",
    description: "Geschiedenis, kunst en herinneringen.",
    color: "--color-topic-erfgoed",
  },
  {
    id: "familie",
    label: "Familie",
    description: "Expliciete familieverhalen en vieringen.",
    color: "--color-topic-familie",
  },
  {
    id: "eten",
    label: "Eten & gezondheid",
    description: "Fruitgerechten en voeding.",
    color: "--color-topic-eten",
  },
  {
    id: "overig",
    label: "Overig",
    description: "Verhalen zonder geselecteerde inhoudelijke tag.",
    color: "--color-topic-overig",
  },
] as const;

export type AtlasCategory = (typeof atlasCategories)[number];
/** Stories without a subject; it has no name on the map. */
export const OTHER_CATEGORY_ID = "overig";

const categoryById = new Map<string, AtlasCategory>(
  atlasCategories.map((category) => [category.id, category]),
);
const otherCategory = atlasCategories[atlasCategories.length - 1];

export function atlasCategory(id: string) {
  return categoryById.get(id);
}

export function categoryColor(id: string) {
  return (categoryById.get(id) ?? otherCategory).color;
}

/** Every category a story belongs to; its primary one when it lists none. */
export function categoriesOf(point: Pick<MapPoint, "topicId" | "categoryIds">) {
  return point.categoryIds ?? [point.topicId];
}

export type AtlasArrangement = "subject" | "meaning";

export interface AtlasFilters {
  category: string | null;
  year: number | null;
  season: Season | null;
  imagesOnly: boolean;
  search: string;
}

export interface AtlasUrlState {
  filters: AtlasFilters;
  /** Slug or id of the selected story. */
  point: string | null;
  arrangement: AtlasArrangement;
}

export const NO_ATLAS_FILTERS: AtlasFilters = {
  category: null,
  year: null,
  season: null,
  imagesOnly: false,
  search: "",
};

export const atlasUrlCodec: UrlCodec<AtlasUrlState> = {
  parse: (params) => {
    // `topic` is the older name of `category`.
    const category = params.get("category") ?? params.get("topic");
    const year = params.get("year");
    const season = params.get("season");
    return {
      filters: {
        category: category && categoryById.has(category) ? category : null,
        year: year && /^\d{4}$/.test(year) ? Number(year) : null,
        season: isSeason(season) ? season : null,
        imagesOnly: ["1", "true", "yes"].includes((params.get("images") ?? "").toLowerCase()),
        search: params.get("q") ?? "",
      },
      point: params.get("point") || null,
      arrangement: params.get("view") === "meaning" ? "meaning" : "subject",
    };
  },
  write: ({ filters, point, arrangement }, params) => {
    for (const legacyKey of ["topic", "cluster"]) params.delete(legacyKey);
    setParam(params, "category", filters.category);
    setParam(params, "year", filters.year === null ? null : String(filters.year));
    setParam(params, "season", filters.season);
    setParam(params, "images", filters.imagesOnly ? "1" : null);
    setParam(params, "q", filters.search.trim() ? filters.search : null);
    setParam(params, "point", point);
    setParam(params, "view", arrangement === "meaning" ? "meaning" : null);
  },
};

export function filterAtlasPoints(points: readonly MapPoint[], filters: AtlasFilters) {
  const query = filters.search.trim().toLowerCase();
  return points.filter(
    (point) =>
      (!filters.category || categoriesOf(point).includes(filters.category)) &&
      (filters.year === null || point.year === filters.year) &&
      (!filters.season || point.season === filters.season) &&
      (!filters.imagesOnly || point.imageCount > 0) &&
      (!query || `${point.title} ${point.excerpt}`.toLowerCase().includes(query)),
  );
}

/** The years that have stories, newest first. */
export function atlasYears(points: readonly MapPoint[]) {
  const years = new Set<number>();
  for (const point of points) if (point.year) years.add(point.year);
  return [...years].toSorted((a, b) => b - a);
}

export function findAtlasPoint(points: readonly MapPoint[], slugOrId: string | null) {
  if (!slugOrId) return null;
  return points.find((point) => point.slug === slugOrId || point.id === slugOrId) ?? null;
}

const NEAREST_COUNT = 10;

/** Ids of the stories closest in meaning: the precomputed neighbours, else the nearest on the map. */
export function relatedAtlasPointIds(points: readonly MapPoint[], selected: MapPoint) {
  if (selected.neighbors?.length) return selected.neighbors;
  return points
    .filter((point) => point.id !== selected.id)
    .map((point) => ({
      id: point.id,
      distance: (point.x - selected.x) ** 2 + (point.y - selected.y) ** 2,
    }))
    .toSorted((a, b) => a.distance - b.distance)
    .slice(0, NEAREST_COUNT)
    .map((point) => point.id);
}

/** A `#rrggbb` colour as `rgba()` with `alpha`, for the canvas. */
export function colorMix(color: string, alpha: number) {
  if (color.startsWith("#") && color.length === 7) {
    const r = Number.parseInt(color.slice(1, 3), 16);
    const g = Number.parseInt(color.slice(3, 5), 16);
    const b = Number.parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}
