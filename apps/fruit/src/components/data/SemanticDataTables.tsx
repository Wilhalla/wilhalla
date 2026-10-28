import { Section, SectionHeader } from "@wilhalla/ui/components/section";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { ArrowDown, ArrowUp, ChevronRight, Download } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wilhalla/ui/components/collapsible";

import { Button } from "@wilhalla/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wilhalla/ui/components/table";

type RawRow = Record<string, unknown>;

type RawDataset = {
  id: string;
  title: string;
  file: string;
  columns: string[];
  rows: RawRow[];
};

type DatasetDefinition = {
  id: string;
  title: string;
  file: string;
  url: string;
  preferredColumns: string[];
  rowsFromData: (value: unknown) => RawRow[];
  autoLoad?: boolean;
};

const isRecord = (value: unknown): value is RawRow =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const rowsFromArray = (value: unknown): RawRow[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => (isRecord(item) ? item : { index, value: item }));
};

const keyValueRows = (value: unknown, skipKeys: string[] = []): RawRow[] => {
  if (!isRecord(value)) return [];
  const skipped = new Set(skipKeys);
  return Object.entries(value)
    .filter(([key]) => !skipped.has(key))
    .map(([key, rawValue]) => ({ key, value: rawValue }));
};

const collectColumns = (rows: RawRow[], preferred: string[] = []): string[] => {
  const columns = new Set<string>(preferred);
  for (const row of rows) {
    for (const key of Object.keys(row)) columns.add(key);
  }
  return Array.from(columns);
};

const stringifyCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
};

const summarizeCell = (value: string): string => {
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 120) return singleLine || "lege waarde";
  return `${singleLine.slice(0, 120)}…`;
};

const downloadDataset = (dataset: RawDataset) => {
  const payload = JSON.stringify(
    {
      file: dataset.file,
      title: dataset.title,
      columns: dataset.columns,
      rows: dataset.rows,
    },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${dataset.id}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const generated = (file: string) => `/generated/${file}`;

const datasetDefinitions: DatasetDefinition[] = [
  {
    id: "manifest",
    title: "Pipeline manifest",
    file: "manifest.json",
    url: generated("manifest.json"),
    preferredColumns: ["key", "value"],
    rowsFromData: keyValueRows,
    autoLoad: true,
  },
  {
    id: "categories",
    title: "Categorieën en aantallen",
    file: "categories.json · categories[]",
    url: generated("categories.json"),
    preferredColumns: ["id", "label", "description", "tagIds", "unitCount", "postCount"],
    rowsFromData: (value) =>
      isRecord(value) && Array.isArray(value.categories) ? rowsFromArray(value.categories) : [],
  },
  {
    id: "topics",
    title: "Onderwerpen",
    file: "topics.json",
    url: generated("topics.json"),
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
    url: generated("map-points.json"),
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
    url: generated("posts-index.json"),
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
    url: generated("post-categories.json"),
    preferredColumns: ["postId", "unitId", "categoryIds", "primaryCategoryId", "tagIds"],
    rowsFromData: (value) =>
      Object.entries(value as Record<string, RawRow>).map(([postId, row]) => ({ postId, ...row })),
  },
  {
    id: "related-posts",
    title: "Related posts",
    file: "related-posts.json",
    url: generated("related-posts.json"),
    preferredColumns: ["postId", "relatedPostIds"],
    rowsFromData: (value) =>
      Object.entries(value as Record<string, string[]>).map(([postId, relatedPostIds]) => ({
        postId,
        relatedPostIds,
      })),
  },
  {
    id: "topic-calendar-summary",
    title: "Categorie kalender",
    file: "topic-calendar.json",
    url: generated("topic-calendar.json"),
    preferredColumns: ["key", "value"],
    rowsFromData: (value) => keyValueRows(value, ["topics"]),
  },
  {
    id: "topic-calendar-topics",
    title: "Categorie kalender per categorie",
    file: "topic-calendar.json · topics[]",
    url: generated("topic-calendar.json"),
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
    rowsFromData: (value) =>
      isRecord(value) && Array.isArray(value.topics) ? rowsFromArray(value.topics) : [],
  },
  {
    id: "entities",
    title: "Entities",
    file: "entities.json",
    url: generated("entities.json"),
    preferredColumns: ["index", "value"],
    rowsFromData: rowsFromArray,
  },
];

function RawCell({ value }: { value: unknown }) {
  const text = stringifyCell(value);
  const isLong = text.length > 180 || text.includes("\n");

  if (isLong) {
    return (
      <Collapsible className="w-[32rem] max-w-[72vw]">
        <CollapsibleTrigger className="group w-full text-left">
          <span className="flex items-start gap-1.5 font-mono text-xs leading-relaxed break-words whitespace-normal text-obsidian">
            <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-gravel transition-transform duration-150 group-data-[state=open]:rotate-90" />
            {summarizeCell(text)}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-3 max-h-80 max-w-full overflow-auto border-l border-chalk bg-transparent pl-3 font-mono text-xs leading-relaxed text-obsidian whitespace-pre-wrap">
            {text}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <code className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-obsidian">
      {text}
    </code>
  );
}

const compactColumnIds = new Set([
  "__row",
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
const mediumColumnIds = new Set(["slug", "date", "isoDate", "season", "key", "url"]);

const columnWidth = (columnId: string) =>
  compactColumnIds.has(columnId) ? "compact" : mediumColumnIds.has(columnId) ? "medium" : "wide";

declare global {
  interface Window {
    __semanticDataTablesReady?: boolean;
  }
}

function RawDataTable({ definition }: { definition: DatasetDefinition }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rows, setRows] = useState<RawRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const columnsList = useMemo(
    () => collectColumns(rows ?? [], definition.preferredColumns),
    [definition.preferredColumns, rows],
  );

  const dataset = useMemo<RawDataset>(
    () => ({
      id: definition.id,
      title: definition.title,
      file: definition.file,
      columns: columnsList,
      rows: rows ?? [],
    }),
    [columnsList, definition.file, definition.id, definition.title, rows],
  );

  const loadDataset = async () => {
    if (rows || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(definition.url, { priority: "low" as RequestInit["priority"] });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const value = await response.json();
      setRows(definition.rowsFromData(value));
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : "Dataset kon niet geladen worden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const element = sectionRef.current;
    if (!definition.autoLoad || !element || rows || loading) return undefined;
    if (!("IntersectionObserver" in window)) {
      loadDataset();
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadDataset();
        }
      },
      { rootMargin: "700px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [definition.autoLoad, loading, rows]);

  const columns = useMemo<ColumnDef<RawRow>[]>(
    () => [
      {
        id: "__row",
        header: "#",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      ...columnsList.map((column) => ({
        id: column,
        accessorFn: (row: RawRow) => stringifyCell(row[column]),
        header: column,
        cell: ({ row }: { row: { original: RawRow } }) => <RawCell value={row.original[column]} />,
        sortingFn: "alphanumeric" as const,
      })),
    ],
    [columnsList],
  );

  const table = useReactTable({
    data: rows ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section
      ref={sectionRef}
      id={definition.id}
      className="min-w-0 border-b border-chalk py-5"
      aria-labelledby={`${definition.id}-title`}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="grid min-w-0 gap-0.5">
          <h3
            id={`${definition.id}-title`}
            className="m-0 font-sans text-body-lg leading-body-lg font-medium text-obsidian"
          >
            {definition.title}
          </h3>
          <p className={cn(typography.small, "m-0 text-gravel")}>
            <code className="font-mono text-mono">{definition.file}</code>
            {rows && ` · ${rows.length.toLocaleString("nl-BE")} rijen`}
          </p>
          {error && (
            <p className={cn(typography.small, "m-0 text-destructive")}>Kon niet laden: {error}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!rows && (
            <Button variant="outline" size="sm" onClick={loadDataset} disabled={loading}>
              {loading ? "Laden…" : "Toon tabel"}
            </Button>
          )}
          {rows && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadDataset(dataset)}
              aria-label={`Download ${definition.title} als JSON`}
            >
              <Download /> JSON
            </Button>
          )}
        </div>
      </div>

      {loading && !rows ? (
        <div className="mt-4 grid gap-2" aria-live="polite">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="h-9 animate-pulse rounded bg-powder/60" key={index} />
          ))}
        </div>
      ) : rows && rows.length === 0 ? (
        <p className={cn(typography.small, "m-0 mt-4 text-gravel")}>Geen rijen in deze dataset.</p>
      ) : rows ? (
        <div className="mt-4 min-w-0 max-w-full overflow-hidden rounded-xl bg-pure-surface shadow-subtle-2">
          <Table
            containerClassName="max-h-[78vh] min-w-0 max-w-full overflow-auto"
            className="w-max min-w-full"
            aria-label={`${definition.title} tabel`}
          >
            <TableHeader data-sticky="true">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        columnWidth(header.column.id) === "compact" && "w-20 min-w-20 max-w-28",
                        columnWidth(header.column.id) === "medium" && "w-40 min-w-32 max-w-52",
                        columnWidth(header.column.id) === "wide" && "min-w-44 max-w-[32rem]",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <Button
                          variant="ghost"
                          size="xs"
                          disabled={!header.column.getCanSort()}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && <ArrowUp />}
                          {header.column.getIsSorted() === "desc" && <ArrowDown />}
                        </Button>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        columnWidth(cell.column.id) === "compact" && "w-20 min-w-20 max-w-28",
                        columnWidth(cell.column.id) === "medium" && "w-40 min-w-32 max-w-52",
                        columnWidth(cell.column.id) === "wide" && "min-w-44 max-w-[32rem]",
                        "align-top whitespace-normal",
                      )}
                      data-sticky={cellIndex === 0 ? "true" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </section>
  );
}

export default function SemanticDataTables() {
  useEffect(() => {
    window.__semanticDataTablesReady = true;
    window.dispatchEvent(new CustomEvent("semantic-data-tables-ready"));
  }, []);

  return (
    <Section aria-labelledby="datasets-title">
      <SectionHeader
        id="datasets-title"
        title="Datasets"
        description="De bestanden achter de onderwerpen, het beeldarchief en het zoeken."
      />
      <div className="min-w-0 border-t border-chalk">
        {datasetDefinitions.map((definition) => (
          <RawDataTable key={definition.id} definition={definition} />
        ))}
      </div>
    </Section>
  );
}
