import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

interface GalleryMonthHeadingProps {
  label: string;
  count: number;
}

export default function GalleryMonthHeading({ label, count }: GalleryMonthHeadingProps) {
  return (
    <header className="flex h-18.5 items-center justify-between border-b border-chalk">
      <h3 className={typography.subsection}>{label}</h3>
      <p className={cn(typography.small, "m-0 text-gravel tabular-nums")}>{count} foto’s</p>
    </header>
  );
}
