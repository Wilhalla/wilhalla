import { layout } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import ArchiveBrowser from "./ArchiveBrowser";
import ArchiveSkeleton from "./ArchiveSkeleton";
import DataBoundary from "./DataBoundary";

/** The full archive: every post, filterable by category, in a virtualized list with a year index. */
export default function ArchiveVirtualList() {
  return (
    <DataBoundary
      fallback={<ArchiveSkeleton />}
      errorTitle="De berichten konden niet worden geladen."
      errorClassName={cn(layout.container, "py-10")}
    >
      <ArchiveBrowser />
    </DataBoundary>
  );
}
