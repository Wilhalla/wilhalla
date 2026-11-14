import { siteConfig } from "@/config";
import { type AgendaEvent, formatEventDate } from "@/modules/agenda-calendar";
import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";

const labels = siteConfig.agenda;

export function UpcomingEvents({ events }: { events: AgendaEvent[] }) {
  return (
    <aside className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-subtle-7 lg:flex-row">
      <div className="border-b border-chalk px-5 py-4 lg:w-70 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-6 lg:py-5">
        <p className={typography.eyebrow}>{labels.upcomingEyebrow}</p>
        <h2 className={cn(typography.heading, "mt-1")}>{labels.upcomingTitle}</h2>
      </div>
      {events.length > 0 ? (
        <div className="grid min-w-0 flex-1 gap-3 p-4 md:grid-cols-cards md:p-5">
          {events.slice(0, labels.maxUpcomingEvents).map((event) => (
            <article key={event.id} className="rounded-2xl border border-chalk bg-eggshell p-4">
              <p className={typography.eyebrow}>{formatEventDate(event)}</p>
              <h3 className={cn(typography.body, "m-0 mt-2 text-obsidian")}>{event.title}</h3>
              {event.location && (
                <p className={cn(typography.small, "m-0 mt-2 text-gravel")}>{event.location}</p>
              )}
              {event.url && (
                <Button asChild variant="outline" className="mt-4">
                  <a href={event.url} target="_blank" rel="noreferrer">
                    {labels.moreInfoLabel}
                  </a>
                </Button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className={cn(typography.small, "m-0 min-w-0 flex-1 p-5 text-gravel")}>
          {labels.noUpcomingEventsText}
        </p>
      )}
    </aside>
  );
}
