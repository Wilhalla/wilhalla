import { Button } from "@wilhalla/ui/components/button";
import { cn } from "@wilhalla/ui/lib/utils";
import type { ReactNode } from "react";
import { displayArchiveYear } from "../lib/archiveDateTime";
import {
  yearPickerAsideClass,
  yearPickerCountClass,
  yearPickerItemClass,
  yearPickerScrollClass,
  yearPickerTitleClass,
} from "./yearPickerStyles";

export interface YearSelectorItem {
  year: string;
  label?: string;
  count: number;
}

interface Props {
  items: readonly YearSelectorItem[];
  activeYear: string;
  title?: string;
  currentLabel?: string;
  ariaLabel?: string;
  className?: string;
  onSelect: (year: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  formatYear?: (year: string) => string;
  footer?: ReactNode;
}

export default function YearSelector({
  items,
  activeYear,
  title = "Jaren",
  currentLabel = "Nu",
  ariaLabel = "Spring naar jaar",
  className = "",
  onSelect,
  onClear,
  clearLabel = "Alle jaren",
  formatYear = displayArchiveYear,
  footer,
}: Props) {
  const currentYear = activeYear || items[0]?.year || "";

  return (
    <aside className={cn(yearPickerAsideClass, className)} aria-label={ariaLabel}>
      <div className={yearPickerScrollClass}>
        <div className="flex items-center justify-between gap-3">
          <p className={yearPickerTitleClass}>{title}</p>
          {onClear && (
            <Button variant="link" size="inline" className="max-md:sr-only" onClick={onClear}>
              {clearLabel}
            </Button>
          )}
        </div>
        <p className="my-3 font-sans text-body leading-body text-gravel max-md:sr-only">
          {currentLabel}: <strong className="text-obsidian">{formatYear(currentYear)}</strong>
        </p>
        <nav className="grid gap-1 md:gap-0.5" aria-label={ariaLabel}>
          {items.map((item) => {
            const isActive = item.year === activeYear;
            const label = item.label ?? formatYear(item.year);
            return (
              <button
                className={yearPickerItemClass}
                data-active={isActive ? "true" : "false"}
                type="button"
                key={item.year}
                aria-label={`Spring naar ${label}, ${item.count} items`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(item.year)}
              >
                <span>{label}</span>
                <span className={yearPickerCountClass}>{item.count}</span>
              </button>
            );
          })}
        </nav>
        {footer && <div className="mt-4 max-md:hidden">{footer}</div>}
      </div>
    </aside>
  );
}
