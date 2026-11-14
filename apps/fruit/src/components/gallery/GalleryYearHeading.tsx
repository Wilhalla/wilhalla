import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { formatNumber } from "../../lib/format";

interface GalleryYearHeadingProps {
  year: string;
  /** Photos of that year in the whole archive. */
  count: number | undefined;
}

export default function GalleryYearHeading({ year, count }: GalleryYearHeadingProps) {
  return (
    <header
      className="flex h-26 scroll-mt-24 items-end justify-between border-b border-chalk pb-5"
      id={`gallery-year-${year}`}
    >
      <p className={cn(typography.small, "m-0 text-gravel")}>
        {count !== undefined && `${formatNumber(count)} foto’s`}
      </p>
      <h2 className={cn(typography.display, "leading-none")}>
        {year === "unknown" ? "Geen datum" : year}
      </h2>
    </header>
  );
}
