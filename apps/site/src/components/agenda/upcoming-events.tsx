import { siteConfig } from "@/config";
import { type AgendaEvent, formatEventDate } from "@/modules/agenda-calendar";
import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

const labels = siteConfig.agenda;

export function UpcomingEvents({ events }: { events: AgendaEvent[] }) {
  return (
    <section aria-labelledby="agenda-upcoming">
      <h2 id="agenda-upcoming" className={cn(typography.subsection, "mb-4")}>
        {labels.upcomingTitle}
      </h2>
      {events.length > 0 ? (
        <ul className="m-0 list-none divide-y divide-chalk border-y border-chalk p-0">
          {events.slice(0, labels.maxUpcomingEvents).map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-x-6 gap-y-1 py-4 md:flex-row md:items-baseline"
            >
              <span className={cn(typography.small, "shrink-0 text-gravel tabular-nums md:w-56")}>
                {formatEventDate(event)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className={cn(typography.body, "m-0 text-obsidian")}>{event.title}</h3>
                {event.location && (
                  <p className={cn(typography.small, "m-0 text-gravel")}>{event.location}</p>
                )}
              </div>
              {event.url && (
                <Button asChild variant="link" size="inline" className="self-start md:self-auto">
                  <a href={event.url} target="_blank" rel="noreferrer">
                    {labels.moreInfoLabel}
                  </a>
                </Button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn(typography.small, "m-0 text-gravel")}>{labels.noUpcomingEventsText}</p>
      )}
    </section>
  );
}
