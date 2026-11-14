import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { atlasCategory } from "../../lib/archiveAtlas";
import { formatLongDate } from "../../lib/archiveDateTime";
import type { AtlasHover } from "../../lib/atlasRenderer";

interface AtlasHoverCardProps {
  hover: AtlasHover;
}

/** Title and date of the story under the mouse, above its dot. */
export default function AtlasHoverCard({ hover }: AtlasHoverCardProps) {
  return (
    <div
      className="pointer-events-none absolute top-(--y) left-(--x) z-10 w-64 -mt-3 -translate-x-1/2 -translate-y-full rounded-xl bg-pure-surface px-3 py-2 shadow-subtle-4"
      style={{ "--x": `${hover.at.x}px`, "--y": `${hover.at.y}px` }}
    >
      <p className="m-0 font-sans text-body leading-body font-medium text-obsidian">
        {hover.point.title}
      </p>
      <p className={cn(typography.caption, "m-0 mt-0.5")}>
        {formatLongDate(hover.point.date)} · {atlasCategory(hover.point.topicId)?.label}
      </p>
    </div>
  );
}
