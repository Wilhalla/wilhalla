import type { HeatmapCell } from "../../lib/archiveStatsTypes";
import { WEEKDAY_LABELS } from "../../lib/format";

const hours = Array.from({ length: 24 }, (_, hour) => hour);

interface WeekHeatmapProps {
  data: readonly HeatmapCell[];
}

/** Posts per weekday and hour; the darker a cell, the more posts. */
export default function WeekHeatmap({ data }: WeekHeatmapProps) {
  const max = Math.max(...data.map((cell) => cell.posts), 1);
  const byKey = new Map(data.map((cell) => [`${cell.day}-${cell.hour}`, cell.posts]));

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-190 grid-cols-[2rem_repeat(24,minmax(1.4rem,1fr))] gap-px text-caption">
        <div />
        {hours.map((hour) => (
          <div
            className="pb-2 text-center font-sans text-caption text-gravel tabular-nums"
            key={hour}
          >
            {hour % 3 === 0 ? hour : ""}
          </div>
        ))}
        {WEEKDAY_LABELS.map((dayLabel, day) => (
          <div className="contents" key={dayLabel}>
            <div className="pt-1.5 pr-2 text-right font-sans text-caption text-gravel">
              {dayLabel}
            </div>
            {hours.map((hour) => {
              const posts = byKey.get(`${day}-${hour}`) ?? 0;
              return (
                <div
                  className="h-7 overflow-hidden rounded-xs bg-powder"
                  key={hour}
                  title={`${dayLabel} ${hour}:00 · ${posts} berichten`}
                >
                  <div
                    className="size-full bg-obsidian/(--share)"
                    style={{ "--share": posts ? `${Math.max(12, (posts / max) * 92)}%` : "0%" }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
