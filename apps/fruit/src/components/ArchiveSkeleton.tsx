import { Skeleton } from "@wilhalla/ui/components/skeleton";
import { layout } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

const rows = Array.from({ length: 18 }, (_, index) => index);

/** Placeholder with the archive's layout while its posts load. */
export default function ArchiveSkeleton() {
  return (
    <div
      className={cn(layout.container, "pt-6 pb-56")}
      aria-busy="true"
      aria-label="Berichten laden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-chalk pb-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-72" />
      </div>
      <div className="grid gap-2 pt-6">
        {rows.map((row) => (
          <Skeleton className="h-16" key={row} />
        ))}
      </div>
    </div>
  );
}
