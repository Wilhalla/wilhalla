import { CalendarEvent } from "@/components/agenda/calendar-event";
import { siteConfig } from "@/config";
import {
  type Agenda,
  type Month,
  eventsOn,
  formatDayLabel,
  monthGridDays,
  monthOf,
} from "@/modules/agenda-calendar";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

/** The month as a list of its days that have events (narrow screens, where a grid cannot hold text). */
export function MonthDayList({ agenda, month }: { agenda: Agenda; month: Month }) {
  const days = monthGridDays(month)
    .filter((day) => monthOf(day) === month)
    .map((day) => ({ day, events: eventsOn(agenda.events, day) }))
    .filter(({ events }) => events.length > 0);

  return (
    <div className="border-y border-chalk md:hidden">
      {days.length > 0 ? (
        <ul className="m-0 list-none divide-y divide-chalk p-0">
          {days.map(({ day, events }) => (
            <li key={day} className="flex gap-4 py-3">
              <span
                className={cn(
                  typography.small,
                  "w-14 shrink-0 tabular-nums",
                  day === agenda.today ? "font-medium text-obsidian" : "text-gravel",
                )}
              >
                {formatDayLabel(day)}
              </span>
              <div className="grid min-w-0 gap-1">
                {events.map((event) => (
                  <CalendarEvent key={event.id} event={event} className={typography.small} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn(typography.small, "m-0 py-4 text-gravel")}>
          {siteConfig.agenda.noEventsInMonthText}
        </p>
      )}
    </div>
  );
}
