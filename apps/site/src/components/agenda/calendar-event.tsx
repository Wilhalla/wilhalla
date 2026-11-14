import type { AgendaEvent } from "@/modules/agenda-calendar";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

/** One event as a line of text: start time, then the title (a link when the event has one). */
export function CalendarEvent({ event, className }: { event: AgendaEvent; className?: string }) {
  return (
    <p className={cn(typography.caption, "m-0 break-words text-obsidian", className)}>
      {event.startTime && (
        <span className="mr-1.5 text-gravel tabular-nums">{event.startTime}</span>
      )}
      {event.url ? (
        <a href={event.url} target="_blank" rel="noreferrer">
          {event.title}
        </a>
      ) : (
        event.title
      )}
    </p>
  );
}
