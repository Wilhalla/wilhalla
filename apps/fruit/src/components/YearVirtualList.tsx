import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@wilhalla/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { useOffsetTop } from "../hooks/useOffsetTop";
import { ACTIVE_YEAR_VIEWPORT_OFFSET, activeYearFromVirtualItems } from "../lib/activeVirtualYear";
import YearSelector, { type YearSelectorItem } from "./YearSelector";

/** How the selector names the current year and offers to clear a year filter. */
type SelectorOptions = Pick<
  ComponentProps<typeof YearSelector>,
  "currentLabel" | "clearLabel" | "onClear"
>;

export interface YearJump extends YearSelectorItem {
  /** Index of the year's first item in `items`; -1 when the list holds nothing of that year. */
  firstIndex: number;
}

interface YearVirtualListProps<T> {
  items: readonly T[];
  years: readonly YearJump[];
  itemKey: (item: T) => string;
  yearOf: (item: T) => string;
  estimateSize: (index: number) => number;
  overscan?: number;
  /** Accessible name of the list. */
  label: string;
  /** Accessible name of the year selector. */
  yearsLabel: string;
  formatYear?: (year: string) => string;
  /** Grid columns of selector and list. */
  className?: string;
  /** Shown above the (empty) list. */
  empty?: ReactNode;
  /** Shown above the list, in its column (filters). */
  header?: ReactNode;
  selector?: SelectorOptions;
  /** A year was chosen that the list holds nothing of. */
  onSelectMissingYear?: (year: string) => void;
  children: (item: T, index: number) => ReactNode;
}

/**
 * A long list in page scroll, virtualized, with a year selector beside it: the selector follows
 * the scroll position and jumps to a year. Owns the virtualizer; callers pass items and a row.
 */
export default function YearVirtualList<T>({
  items,
  years,
  itemKey,
  yearOf,
  estimateSize,
  overscan = 12,
  label,
  yearsLabel,
  formatYear,
  className,
  empty,
  header,
  selector,
  onSelectMissingYear,
  children,
}: YearVirtualListProps<T>) {
  // The virtualizer is one stable object whose methods read state that changes on scroll, which
  // memoization would freeze. React Compiler 1.0 knows this for `useVirtualizer` but not yet for
  // `useWindowVirtualizer`; drop the directive once it reports it as an incompatible library.
  "use no memo";
  const [listRef, scrollMargin] = useOffsetTop();
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize,
    overscan,
    scrollMargin,
    getItemKey: (index) => {
      const item = items[index];
      return item ? itemKey(item) : index;
    },
  });
  const virtualItems = virtualizer.getVirtualItems();
  const activeYear = activeYearFromVirtualItems(
    items,
    virtualItems,
    yearOf,
    (virtualizer.scrollOffset ?? 0) + ACTIVE_YEAR_VIEWPORT_OFFSET,
  );

  return (
    <section className={cn("grid items-start", className)}>
      <YearSelector
        items={years}
        activeYear={activeYear}
        ariaLabel={yearsLabel}
        formatYear={formatYear}
        {...selector}
        onSelect={(year) => {
          const jump = years.find((item) => item.year === year);
          if (jump && jump.firstIndex >= 0)
            virtualizer.scrollToIndex(jump.firstIndex, { align: "start" });
          else onSelectMissingYear?.(year);
        }}
      />
      <div className="min-w-0">
        {header}
        <section ref={listRef} className="scroll-mt-24" aria-label={label}>
          {empty}
          <div
            className="relative h-(--total-size)"
            style={{ "--total-size": `${virtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualItem) => {
              const item = items[virtualItem.index];
              return (
                item !== undefined && (
                  <div
                    ref={virtualizer.measureElement}
                    className="absolute top-0 left-0 w-full translate-y-(--row-start)"
                    data-index={virtualItem.index}
                    key={virtualItem.key}
                    style={{ "--row-start": `${virtualItem.start - scrollMargin}px` }}
                  >
                    {children(item, virtualItem.index)}
                  </div>
                )
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
