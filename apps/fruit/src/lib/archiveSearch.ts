import MiniSearch, { type SearchResult } from "minisearch";
import { archivePostsResource, cachedResource } from "./generatedData";
import {
  SEARCH_FUZZY,
  SEARCH_INDEX_FIELDS,
  SEARCH_STORE_FIELDS,
  type ArchiveClientPost,
  type PostCategoryIds,
  type SearchDoc,
} from "./generatedTypes";
import { setParam, type UrlCodec } from "./urlState";

export const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 40;
const LOOSE_FUZZY = 0.24;

export interface SearchUrlState {
  query: string;
  /** Category the results are limited to; null searches everything. */
  category: string | null;
}

export const searchUrlCodec: UrlCodec<SearchUrlState> = {
  parse: (params) => {
    const category = params.get("category");
    return {
      query: params.get("q") ?? "",
      category: category && category !== "all" ? category : null,
    };
  },
  write: (state, params) => {
    setParam(params, "q", state.query.trim() ? state.query : null);
    setParam(params, "category", state.category);
  },
};

/** A post found by the search. `block` is the matching text, or null for a match in the title. */
export interface SearchHit {
  id: string;
  postId: string;
  url: string;
  title: string;
  date: string;
  isoDate: string;
  imageCount: number;
  terms: string[];
  block: string | null;
}

export interface CategoryFilter {
  category: string | null;
  /** Needed when `category` is set. */
  postCategoryIds: PostCategoryIds | null;
}

type TitleDoc = Pick<
  SearchDoc,
  "id" | "postId" | "url" | "title" | "date" | "isoDate" | "imageCount"
>;

const titleSearchOptions = {
  boost: { title: 5 },
  prefix: true,
  fuzzy: 0.15,
  combineWith: "AND",
} as const;

const fullTextSearchOptions = {
  boost: { title: 5, excerpt: 2.5, block: 1 },
  prefix: true,
  fuzzy: SEARCH_FUZZY,
  combineWith: "AND",
} as const;

export function buildTitleIndex(posts: readonly ArchiveClientPost[]) {
  const index = new MiniSearch<TitleDoc>({
    fields: ["title"],
    storeFields: ["postId", "url", "title", "date", "isoDate", "imageCount"],
    searchOptions: titleSearchOptions,
  });
  index.addAll(
    posts.map((post) => ({
      id: post.id,
      postId: post.id,
      url: `/posts/${post.slug}/`,
      title: post.title,
      date: post.date,
      isoDate: post.isoDate,
      imageCount: post.imageCount,
    })),
  );
  return index;
}

/** The title index, built once from the archive list the first time someone searches. */
export const titleIndexResource = cachedResource("title-index", async () =>
  buildTitleIndex((await archivePostsResource.load()).aggregated),
);

/** One year of the full-text index, from its serialized JSON. */
export function loadSearchChunk(json: string) {
  return MiniSearch.loadJSON<SearchDoc>(json, {
    fields: [...SEARCH_INDEX_FIELDS],
    storeFields: [...SEARCH_STORE_FIELDS],
    searchOptions: fullTextSearchOptions,
  });
}

const storedText = (value: unknown) => (typeof value === "string" ? value : "");

function hitFromResult(result: SearchResult): SearchHit {
  return {
    id: String(result.id),
    postId: storedText(result.postId),
    url: storedText(result.url),
    title: storedText(result.title),
    date: storedText(result.date),
    isoDate: storedText(result.isoDate),
    imageCount: typeof result.imageCount === "number" ? result.imageCount : 0,
    terms: result.terms,
    block: typeof result.block === "string" ? result.block : null,
  };
}

function matchesCategory(result: SearchResult, filter: CategoryFilter) {
  if (!filter.category) return true;
  return Boolean(filter.postCategoryIds?.[storedText(result.postId)]?.includes(filter.category));
}

/** Strict first (every word must match); only when that finds nothing, any word and fuzzier. */
function strictThenLoose<T>(
  index: MiniSearch<T>,
  query: string,
  loose: Parameters<MiniSearch<T>["search"]>[1],
) {
  const strict = index.search(query);
  return strict.length ? strict : index.search(query, loose);
}

export function searchTitles(
  index: MiniSearch<TitleDoc>,
  query: string,
  filter: CategoryFilter,
): SearchHit[] {
  if (query.length < MIN_QUERY_LENGTH) return [];
  return strictThenLoose(index, query, {
    ...titleSearchOptions,
    fuzzy: LOOSE_FUZZY,
    combineWith: "OR",
  })
    .filter((result) => matchesCategory(result, filter))
    .slice(0, MAX_RESULTS)
    .map(hitFromResult);
}

/** The best-scoring block of each post across the loaded years. */
export function searchFullText(
  indexes: readonly MiniSearch<SearchDoc>[],
  query: string,
  filter: CategoryFilter,
): SearchHit[] {
  if (query.length < MIN_QUERY_LENGTH) return [];
  const bestByPost = new Map<string, SearchResult>();
  for (const index of indexes) {
    const results = strictThenLoose(index, query, {
      ...fullTextSearchOptions,
      boost: { title: 5, excerpt: 2, block: 1 },
      fuzzy: LOOSE_FUZZY,
      combineWith: "OR",
    });
    for (const result of results) {
      if (!matchesCategory(result, filter)) continue;
      const postId = storedText(result.postId);
      const previous = bestByPost.get(postId);
      if (!previous || result.score > previous.score) bestByPost.set(postId, result);
    }
  }
  return [...bestByPost.values()]
    .toSorted((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(hitFromResult);
}

/** The part of a block around the first matching term. */
export function snippet(block: string, terms: readonly string[]) {
  const lower = block.toLowerCase();
  const positions = terms.map((term) => lower.indexOf(term.toLowerCase())).filter((at) => at >= 0);
  if (!positions.length) return block.slice(0, 320);
  const first = Math.min(...positions);
  const start = Math.max(0, first - 130);
  const end = Math.min(block.length, first + 260);
  return `${start > 0 ? "…" : ""}${block.slice(start, end)}${end < block.length ? "…" : ""}`;
}

/** `text` cut at every matching term: the odd parts are the matches. */
export function splitOnTerms(text: string, terms: readonly string[]) {
  const escaped = terms
    .filter((term) => term.length > 1)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return [text];
  return text.split(new RegExp(`(${escaped.join("|")})`, "i"));
}
