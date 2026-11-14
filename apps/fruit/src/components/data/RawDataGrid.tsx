import { Button } from "@wilhalla/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wilhalla/ui/components/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { DatasetColumn, DatasetRow, LoadedDataset } from "../../lib/rawDatasets";
import RawCell from "./RawCell";

const ROW_NUMBER = "__row";
const ROW_HEIGHT = 41;
/** Narrowest and widest a column of each kind gets; in between it fits its longest cell. */
const widthRange = {
  compact: ["5rem", "7rem"],
  medium: ["8rem", "13rem"],
  wide: ["11rem", "32rem"],
} as const;

function columnSize(column: DatasetColumn | undefined) {
  if (!column) return "3.5rem";
  const [min, max] = widthRange[column.width];
  return `clamp(${min}, ${column.chars}ch, ${max})`;
}

const sizedCell = "w-(--column-size) max-w-(--column-size) min-w-(--column-size)";

interface RawDataGridProps {
  title: string;
  dataset: LoadedDataset;
}

/**
 * A sortable table of a whole dataset. Only the rows in view are in the DOM, so a file of
 * thousands of rows scrolls like a small one; column widths come from the data, not from the
 * rows that happen to be rendered.
 */
export default function RawDataGrid({ title, dataset }: RawDataGridProps) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  // TanStack Table needs stable column definitions and data.
  const columns = useMemo<ColumnDef<DatasetRow, string>[]>(
    () => [
      { id: ROW_NUMBER, header: "#", enableSorting: false },
      ...dataset.columns.map((column) => ({
        id: column.id,
        header: column.id,
        accessorFn: (row: DatasetRow) => row.text[column.id] ?? "",
        sortingFn: "alphanumeric" as const,
      })),
    ],
    [dataset.columns],
  );
  const data = useMemo(() => [...dataset.rows], [dataset.rows]);
  const sizes = useMemo(
    () => new Map(dataset.columns.map((column) => [column.id, columnSize(column)])),
    [dataset.columns],
  );
  const sizeOf = (columnId: string) => sizes.get(columnId) ?? columnSize(undefined);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const rows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableRef.current?.parentElement ?? null,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
    // Before the container is measured (server render, first paint): one screen of rows.
    initialRect: { width: 0, height: 800 },
  });
  const virtualRows = virtualizer.getVirtualItems();
  const spaceAbove = virtualRows[0]?.start ?? 0;
  const spaceBelow = virtualizer.getTotalSize() - (virtualRows.at(-1)?.end ?? 0);
  const columnCount = columns.length;

  return (
    <div className="mt-4 max-w-full min-w-0 overflow-hidden rounded-xl bg-pure-surface shadow-subtle-2">
      <Table
        ref={tableRef}
        containerClassName="max-h-below-navbar min-w-0 max-w-full overflow-auto"
        className="w-max min-w-full"
        aria-label={`${title} tabel`}
        aria-rowcount={rows.length + 1}
      >
        <TableHeader data-sticky="true">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={sizedCell}
                  style={{ "--column-size": sizeOf(header.column.id) }}
                >
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
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {spaceAbove > 0 && (
            <tr aria-hidden="true">
              <td
                aria-hidden="true"
                colSpan={columnCount}
                className="h-(--space)"
                style={{ "--space": `${spaceAbove}px` }}
              />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              row && (
                <TableRow
                  key={row.id}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  aria-rowindex={virtualRow.index + 2}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`${sizedCell} align-top whitespace-normal`}
                      style={{ "--column-size": sizeOf(cell.column.id) }}
                      data-sticky={cellIndex === 0 ? "true" : undefined}
                    >
                      {cell.column.id === ROW_NUMBER ? (
                        row.index + 1
                      ) : (
                        <RawCell text={row.original.text[cell.column.id] ?? ""} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            );
          })}
          {spaceBelow > 0 && (
            <tr aria-hidden="true">
              <td
                aria-hidden="true"
                colSpan={columnCount}
                className="h-(--space)"
                style={{ "--space": `${spaceBelow}px` }}
              />
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
