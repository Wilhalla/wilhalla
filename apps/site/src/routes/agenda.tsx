import { MarkdownContent } from "@/components/markdown-content";
import { PageHeader } from "@/components/page-header";
import { agendaRegistry, editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  type AgendaEvent,
  addMonths,
  createAgendaMonth,
  fetchGoogleCalendarAgendaEvents,
  formatAgendaEventDate,
  formatAgendaEventTime,
  formatAgendaMonth,
  getDayKey,
  getInitialAgendaMonth,
  getUpcomingAgendaEvents,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "@/modules/agenda-calendar";
import { editorialRouteHead } from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const agendaContent = getEditorialPageHtml("agenda");
import { createServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

const getAgendaEvents = createServerFn({ method: "GET" }).handler(() =>
  fetchGoogleCalendarAgendaEvents(),
);

export const Route = createFileRoute("/agenda")({
  loader: () => getAgendaEvents(),
  head: () => editorialRouteHead(editorialPages.agenda, "/agenda"),
  component: AgendaPage,
});

function AgendaPage() {
  const events = Route.useLoaderData();

  return (
    <div>
      <PageHeader
        title={editorialPages.agenda.title}
        intro={editorialPages.agenda.intro}
      />

      <section className="site-container py-10 md:py-16">
        <div className="max-w-[820px]">
          <MarkdownContent html={agendaContent} />
        </div>

        <AgendaCalendar events={events} />
      </section>
    </div>
  );
}

function AgendaCalendar({ events }: { events: Array<AgendaEvent> }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const upcomingEvents = useMemo(
    () => getUpcomingAgendaEvents(events, today),
    [events, today],
  );
  const initialMonth = useMemo(
    () => getInitialAgendaMonth(events, today),
    [today, events],
  );
  const [visibleMonth, setVisibleMonth] = useState(initialMonth);
  const { days: calendarDays, eventsByDay } = useMemo(
    () => createAgendaMonth(events, visibleMonth),
    [events, visibleMonth],
  );

  return (
    <div className="mt-12 flex flex-col gap-6">
      <aside className="eleven-card overflow-hidden">
        <div className="grid bg-white lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="border-b border-chalk px-5 py-4 lg:border-r lg:border-b-0 lg:px-6 lg:py-5">
            <p className="el-label m-0 text-gravel">
              {agendaRegistry.upcomingEyebrow}
            </p>
            <h2 className="el-heading-sm m-0 mt-1 text-obsidian">
              {agendaRegistry.upcomingTitle}
            </h2>
          </div>
          <div className="bg-white">
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-3 p-4 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:p-5">
                {upcomingEvents
                  .slice(0, agendaRegistry.maxUpcomingEvents)
                  .map((event) => (
                    <article
                      key={event.id}
                      className="rounded-2xl border border-chalk bg-eggshell p-4"
                    >
                      <p className="el-label m-0 text-gravel">
                        {formatAgendaEventDate(event)}
                      </p>
                      <h3 className="el-body m-0 mt-2 text-obsidian">
                        {event.title}
                      </h3>
                      {event.location && (
                        <p className="el-body-sm m-0 mt-2 text-gravel">
                          {event.location}
                        </p>
                      )}
                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noreferrer"
                          className="eleven-pill-ghost mt-4"
                        >
                          {agendaRegistry.moreInfoLabel}
                        </a>
                      )}
                    </article>
                  ))}
              </div>
            ) : (
              <p className="el-body-sm m-0 p-5 text-gravel">
                {agendaRegistry.noUpcomingEventsText}
              </p>
            )}
          </div>
        </div>
      </aside>

      <div className="eleven-card overflow-hidden">
        <div className="flex flex-col gap-5 border-b border-chalk bg-white px-4 py-4 md:px-6">
          <div className="flex justify-end">
            <a
              href={agendaRegistry.calendarGoogleUrl}
              target="_blank"
              rel="noreferrer"
              className="eleven-pill-ghost w-fit"
            >
              {agendaRegistry.openInGoogleLabel}
            </a>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="eleven-pill-ghost"
                onClick={() => setVisibleMonth(startOfMonth(today))}
              >
                {agendaRegistry.todayLabel}
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-chalk bg-white text-obsidian shadow-subtle-2 transition-transform hover:-translate-y-0.5"
                aria-label={agendaRegistry.previousMonthLabel}
                onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
              >
                ←
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-chalk bg-white text-obsidian shadow-subtle-2 transition-transform hover:-translate-y-0.5"
                aria-label={agendaRegistry.nextMonthLabel}
                onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
              >
                →
              </button>
            </div>
            <h3 className="el-heading-sm m-0 text-obsidian">
              {formatAgendaMonth(visibleMonth)}
            </h3>
          </div>
        </div>

        <div className="bg-powder p-2 md:p-4">
          <div className="overflow-x-auto rounded-2xl bg-white shadow-subtle">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-7 border-b border-chalk bg-eggshell">
                {agendaRegistry.weekdays.map((day) => (
                  <div
                    key={day}
                    className="el-label px-2 py-3 text-center text-gravel"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day) => {
                  const dayKey = getDayKey(day);
                  const dayEvents = eventsByDay.get(dayKey) ?? [];
                  const outsideMonth =
                    day.getMonth() !== visibleMonth.getMonth();
                  const isToday = isSameDay(day, today);
                  const isEndOfWeek = day.getDay() === 0;

                  return (
                    <div
                      key={dayKey}
                      className={`min-h-[146px] border-chalk border-r border-b bg-white p-2.5 transition-colors hover:bg-powder md:min-h-[168px] md:p-3 lg:min-h-[188px] ${
                        isEndOfWeek ? "border-r-0" : ""
                      } ${outsideMonth ? "text-slate" : "text-obsidian"}`}
                    >
                      <div className="mb-2 flex justify-end">
                        <span
                          className={`el-label grid h-7 min-w-7 place-items-center rounded-full px-2 ${
                            isToday
                              ? "bg-obsidian text-eggshell"
                              : outsideMonth
                                ? "text-slate"
                                : "text-obsidian"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {dayEvents
                          .slice(0, agendaRegistry.maxEventsPerDay)
                          .map((event) => (
                            <EventChip
                              key={`${event.id}-${dayKey}`}
                              event={event}
                            />
                          ))}
                        {dayEvents.length > agendaRegistry.maxEventsPerDay && (
                          <div className="el-label rounded-full bg-powder px-2 py-1 text-gravel">
                            +{dayEvents.length - agendaRegistry.maxEventsPerDay}{" "}
                            {agendaRegistry.moreEventsLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventChip({ event }: { event: AgendaEvent }) {
  return (
    <div className="rounded-xl border border-chalk bg-eggshell px-2.5 py-2 shadow-subtle-2 md:px-3">
      <div className="flex items-start gap-1.5">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
        <span className="min-w-0 break-words font-medium text-[13px] leading-snug text-obsidian md:text-sm">
          {event.title}
        </span>
      </div>
      {!event.allDay && (
        <p className="el-mono m-0 mt-1 text-gravel">
          {formatAgendaEventTime(event)}
        </p>
      )}
    </div>
  );
}
