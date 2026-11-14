/** The data explorer shows the generated JSON files as they are: rows of arbitrary values. */
export type RawRow = Record<string, unknown>;

function isRecord(value: unknown): value is RawRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export interface DatasetDefinition {
  id: string;
  title: string;
  /** Shown to the reader: the file, and the part of it when the table shows only a part. */
  file: string;
  /** File under `/generated/`. */
  source: string;
  preferredColumns: readonly string[];
  rowsFromData: (value: unknown) => RawRow[];
}

export type ColumnWidth = "compact" | "medium" | "wide";

export interface DatasetColumn {
  id: string;
  width: ColumnWidth;
  /** Length of the longest text the column has to show on one line, heading included. */
  chars: number;
}

export interface DatasetRow {
  raw: RawRow;
  /** Every cell as text, by column id: what is shown, sorted on and measured. */
  text: Record<string, string>;
}

export interface LoadedDataset {
  columns: readonly DatasetColumn[];
  rows: readonly DatasetRow[];
}

const LONG_CELL = 180;
const SUMMARY_CHARS = 120;

function rowsFromArray(value: unknown): RawRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((item: unknown, index) => (isRecord(item) ? item : { index, value: item }));
}

function keyValueRows(value: unknown, skipKeys: readonly string[] = []): RawRow[] {
  if (!isRecord(value)) return [];
  return Object.entries(value)
    .filter(([key]) => !skipKeys.includes(key))
    .map(([key, rawValue]) => ({ key, value: rawValue }));
}

/** An object keyed by post id becomes one row per post. */
function rowsByPostId(value: unknown, valueColumn: string): RawRow[] {
  if (!isRecord(value)) return [];
  return Object.entries(value).map(([postId, row]) =>
    isRecord(row) ? { postId, ...row } : { postId, [valueColumn]: row },
  );
}

const listIn = (value: unknown, key: string) => (isRecord(value) ? rowsFromArray(value[key]) : []);

export function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

/** A cell this long, or with line breaks, is shown collapsed. */
export function isLongCell(text: string) {
  return text.length > LONG_CELL || text.includes("\n");
}

export function summarizeCell(text: string) {
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (singleLine.length <= SUMMARY_CHARS) return singleLine || "lege waarde";
  return `${singleLine.slice(0, SUMMARY_CHARS)}…`;
}

const compactColumns = new Set([
  "id",
  "postId",
  "topicId",
  "year",
  "month",
  "x",
  "y",
  "imageCount",
  "postCount",
  "total",
]);
const mediumColumns = new Set(["slug", "date", "isoDate", "season", "key", "url"]);

function columnWidth(id: string): ColumnWidth {
  return compactColumns.has(id) ? "compact" : mediumColumns.has(id) ? "medium" : "wide";
}

/** Turns a fetched file into the table's rows and columns, stringifying every cell once. */
export function buildDataset(definition: DatasetDefinition, value: unknown): LoadedDataset {
  const rawRows = definition.rowsFromData(value);
  const columnIds = new Set(definition.preferredColumns);
  for (const row of rawRows) for (const key of Object.keys(row)) columnIds.add(key);

  const chars = new Map([...columnIds].map((id) => [id, id.length + 4]));
  const rows = rawRows.map((raw) => {
    const text: Record<string, string> = {};
    for (const id of columnIds) {
      const cell = stringifyCell(raw[id]);
      text[id] = cell;
      const shown = isLongCell(cell) ? SUMMARY_CHARS : cell.length;
      if (shown > (chars.get(id) ?? 0)) chars.set(id, shown);
    }
    return { raw, text };
  });

  return {
    rows,
    columns: [...columnIds].map((id) => ({
      id,
      width: columnWidth(id),
      chars: chars.get(id) ?? 0,
    })),
  };
}

/** The dataset as the JSON a reader downloads. */
export function datasetDownload(definition: DatasetDefinition, dataset: LoadedDataset) {
  return JSON.stringify(
    {
      file: definition.file,
      title: definition.title,
      columns: dataset.columns.map((column) => column.id),
      rows: dataset.rows.map((row) => row.raw),
    },
    null,
    2,
  );
}

/** The manifest is small and known at build time: the page shows it without a request. */
export const MANIFEST_DATASET_ID = "manifest";

export const datasetDefinitions: readonly DatasetDefinition[] = [
  {
    id: MANIFEST_DATASET_ID,
    title: "Pipeline manifest",
    file: "manifest.json",
    source: "manifest.json",
    preferredColumns: ["key", "value"],
    rowsFromData: keyValueRows,
  },
  {
    id: "categories",
    title: "Categorieën en aantallen",
    file: "categories.json · categories[]",
    source: "categories.json",
    preferredColumns: ["id", "label", "description", "tagIds", "unitCount", "postCount"],
    rowsFromData: (value) => listIn(value, "categories"),
  },
  {
    id: "topics",
    title: "Onderwerpen",
    file: "topics.json",
    source: "topics.json",
    preferredColumns: [
      "id",
      "label",
      "generatedLabel",
      "postCount",
      "visualKeywords",
      "textKeywords",
      "representativePostIds",
    ],
    rowsFromData: rowsFromArray,
  },
  {
    id: "map-points",
    title: "Map points",
    file: "map-points.json",
    source: "map-points.json",
    preferredColumns: [
      "id",
      "slug",
      "title",
      "date",
      "year",
      "month",
      "season",
      "topicId",
      "categoryIds",
      "tagIds",
      "postIds",
      "neighbors",
      "x",
      "y",
      "imageCount",
      "image",
      "excerpt",
    ],
    rowsFromData: rowsFromArray,
  },
  {
    id: "posts-index",
    title: "Posts index",
    file: "posts-index.json",
    source: "posts-index.json",
    preferredColumns: [
      "id",
      "slug",
      "title",
      "date",
      "isoDate",
      "year",
      "month",
      "season",
      "topicId",
      "imageCount",
      "url",
      "excerpt",
      "cleanedText",
      "images",
      "tags",
    ],
    rowsFromData: rowsFromArray,
  },
  {
    id: "post-categories",
    title: "Berichtcategorieën",
    file: "post-categories.json",
    source: "post-categories.json",
    preferredColumns: ["postId", "unitId", "categoryIds", "primaryCategoryId", "tagIds"],
    rowsFromData: (value) => rowsByPostId(value, "value"),
  },
  {
    id: "related-posts",
    title: "Related posts",
    file: "related-posts.json",
    source: "related-posts.json",
    preferredColumns: ["postId", "relatedPostIds"],
    rowsFromData: (value) => rowsByPostId(value, "relatedPostIds"),
  },
  {
    id: "topic-calendar-summary",
    title: "Categorie kalender",
    file: "topic-calendar.json",
    source: "topic-calendar.json",
    preferredColumns: ["key", "value"],
    rowsFromData: (value) => keyValueRows(value, ["topics"]),
  },
  {
    id: "topic-calendar-topics",
    title: "Categorie kalender per categorie",
    file: "topic-calendar.json · topics[]",
    source: "topic-calendar.json",
    preferredColumns: [
      "topicId",
      "label",
      "generatedLabel",
      "postCount",
      "total",
      "monthsAllYears",
      "seasonsAllYears",
      "years",
    ],
    rowsFromData: (value) => listIn(value, "topics"),
  },
  {
    id: "entities",
    title: "Entities",
    file: "entities.json",
    source: "entities.json",
    preferredColumns: ["index", "value"],
    rowsFromData: rowsFromArray,
  },
];
