import { searchWithState, setParam, type UrlCodec } from "./urlState";

export const SEASONS = ["lente", "zomer", "herfst", "winter"] as const;
export type Season = (typeof SEASONS)[number];

/** What narrows the image archive; `null` means "no filter on this". */
export interface GalleryFilters {
  query: string;
  year: string | null;
  theme: string | null;
  species: string | null;
  season: Season | null;
  sortNewest: boolean;
}

/** The gallery pages' URL state: the filters and, on the viewer and slideshow, the photo shown. */
export interface GalleryUrlState extends GalleryFilters {
  imageId: string | null;
}

export const defaultGalleryFilters: GalleryFilters = {
  query: "",
  year: null,
  theme: null,
  species: null,
  season: null,
  sortNewest: true,
};

export function isSeason(value: string | null): value is Season {
  return SEASONS.some((season) => season === value);
}

export function hasActiveGalleryFilters(filters: GalleryFilters) {
  return Boolean(
    filters.query.trim() ||
    filters.theme ||
    filters.species ||
    filters.year ||
    filters.season ||
    !filters.sortNewest,
  );
}

/** "all" was the old spelling of "no filter"; links with it keep working. */
const filterParam = (value: string | null) => (value && value !== "all" ? value : null);

export const galleryUrlCodec: UrlCodec<GalleryUrlState> = {
  parse: (params) => {
    const season = params.get("season");
    return {
      query: params.get("q") ?? "",
      theme: filterParam(params.get("theme")),
      species: filterParam(params.get("species")),
      year: filterParam(params.get("year")),
      season: isSeason(season) ? season : null,
      sortNewest: params.get("sort") !== "old",
      imageId: params.get("img") || params.get("image"),
    };
  },
  write: (state, params) => {
    setParam(params, "q", state.query);
    setParam(params, "theme", state.theme);
    setParam(params, "species", state.species);
    setParam(params, "year", state.year);
    setParam(params, "season", state.season);
    setParam(params, "sort", state.sortNewest ? null : "old");
    setParam(params, "img", state.imageId);
    params.delete("image");
  },
};

export const galleryRoutes = {
  grid: "/gallery/",
  viewer: "/gallery/view/",
  slideshow: "/gallery/slideshow/",
} as const;
export type GalleryRoute = keyof typeof galleryRoutes;

/** A link to a gallery page that carries the filters; the grid never carries a photo. */
export function galleryHref(route: GalleryRoute, state: GalleryUrlState) {
  const imageId = route === "grid" ? null : state.imageId;
  return `${galleryRoutes[route]}${searchWithState(galleryUrlCodec, { ...state, imageId }, "")}`;
}
