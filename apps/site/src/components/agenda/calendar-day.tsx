import { CalendarEvent } from "@/components/agenda/calendar-event";
import { type AgendaEvent, type Day, dayOfMonth } from "@/modules/agenda-calendar";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

interface CalendarDayProps {
  day: Day;
  events: AgendaEvent[];
  today: boolean;
  outsideMonth: boolean;
}

/** A cell of the month grid (wide screens). */
export function CalendarDay({ day, events, today, outsideMonth }: CalendarDayProps) {
  return (
    <div className="min-h-28 border-r border-b border-chalk p-2">
      <span
        className={cn(
          typography.caption,
          "mb-1 grid size-6 place-items-center rounded-full tabular-nums",
          !outsideMonth && "text-obsidian",
          today && "bg-obsidian text-eggshell",
        )}
      >
        {dayOfMonth(day)}
      </span>
      <div className="grid gap-1.5">
        {events.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
