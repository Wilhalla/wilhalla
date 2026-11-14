import { EventChip } from "@/components/agenda/event-chip";
import { siteConfig } from "@/config";
import { type AgendaEvent, type Day, dayOfMonth } from "@/modules/agenda-calendar";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

const { maxEventsPerDay, moreEventsLabel } = siteConfig.agenda;

interface CalendarDayProps {
  day: Day;
  events: AgendaEvent[];
  today: boolean;
  outsideMonth: boolean;
}

export function CalendarDay({ day, events, today, outsideMonth }: CalendarDayProps) {
  return (
    <div className="min-h-36 border-r border-b border-chalk p-2.5 transition-colors duration-hover ease-out hover:bg-powder md:min-h-42 md:p-3 lg:min-h-47 nth-[7n]:border-r-0">
      <div className="mb-2 flex justify-end">
        <span
          className={cn(
            typography.small,
            "grid h-7 min-w-7 place-items-center rounded-full px-2 tabular-nums",
            outsideMonth ? "text-gravel" : "text-obsidian",
            today && "bg-obsidian text-eggshell",
          )}
        >
          {dayOfMonth(day)}
        </span>
      </div>
      <div className="space-y-2">
        {events.slice(0, maxEventsPerDay).map((event) => (
          <EventChip key={event.id} event={event} />
        ))}
        {events.length > maxEventsPerDay && (
          <div className={cn(typography.small, "rounded-full bg-powder px-2 py-1 text-gravel")}>
            +{events.length - maxEventsPerDay} {moreEventsLabel}
          </div>
        )}
      </div>
    </div>
  );
}
