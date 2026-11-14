import { CalendarDay } from "@/components/agenda/calendar-day";
import { MonthDayList } from "@/components/agenda/month-day-list";
import { siteConfig } from "@/config";
import {
  type Agenda,
  type Month,
  addMonths,
  eventsOn,
  formatMonth,
  monthGridDays,
  monthOf,
} from "@/modules/agenda-calendar";
import { Link } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const labels = siteConfig.agenda;

/** Month links replace the history entry and keep the scroll position: paging is not a page change. */
const monthLink = {
  to: "/agenda",
  replace: true,
  resetScroll: false,
  viewTransition: false,
} as const;

export function MonthCalendar({ agenda, month }: { agenda: Agenda; month: Month }) {
  return (
    <section aria-labelledby="agenda-month">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id="agenda-month" className={typography.subsection}>
          {formatMonth(month)}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link
              {...monthLink}
              search={{ maand: addMonths(month, -1) }}
              aria-label={labels.previousMonthLabel}
            >
              <ChevronLeft />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link {...monthLink} search={{ maand: monthOf(agenda.today) }}>
              {labels.todayLabel}
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link
              {...monthLink}
              search={{ maand: addMonths(month, 1) }}
              aria-label={labels.nextMonthLabel}
            >
              <ChevronRight />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={labels.calendarGoogleUrl} target="_blank" rel="noreferrer">
              <img src="/icons/google-calendar.svg" alt="" className="size-4" />
              {labels.openInGoogleLabel}
            </a>
          </Button>
        </div>
      </div>

      <MonthDayList agenda={agenda} month={month} />

      <div className="hidden grid-cols-7 border-t border-l border-chalk md:grid">
        {labels.weekdays.map((weekday) => (
          <div
            key={weekday}
            className={cn(typography.caption, "border-r border-b border-chalk px-2 py-1.5")}
          >
            {weekday}
          </div>
        ))}
        {monthGridDays(month).map((day) => (
          <CalendarDay
            key={day}
            day={day}
            events={eventsOn(agenda.events, day)}
            today={day === agenda.today}
            outsideMonth={monthOf(day) !== month}
          />
        ))}
      </div>
    </section>
  );
}
