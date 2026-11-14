import type { CalendarBurst } from "../../lib/archiveStatsTypes";
import { formatNumber } from "../../lib/format";

interface BusiestDaysProps {
  days: readonly CalendarBurst[];
}

export default function BusiestDays({ days }: BusiestDaysProps) {
  return (
    <div className="grid gap-1">
      {days.map((day) => (
        <div
          className="flex items-center justify-between gap-4 border-t border-chalk py-3"
          key={day.date}
        >
          <div className="min-w-0">
            <div className="font-sans text-body leading-body font-medium">{day.label}</div>
            <div className="mt-1 font-sans text-caption leading-caption text-gravel">
              {formatNumber(day.images)} beelden · {formatNumber(day.reactions)} reacties
            </div>
          </div>
          <div className="font-sans text-heading-sm tabular-nums">{day.posts}</div>
        </div>
      ))}
    </div>
  );
}
