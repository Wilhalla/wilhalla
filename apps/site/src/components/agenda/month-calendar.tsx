import { CalendarDay } from "@/components/agenda/calendar-day";
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
    <div className="overflow-hidden rounded-2xl bg-card shadow-subtle-7 md:rounded-3xl">
      <div className="flex flex-col gap-5 border-b border-chalk px-4 py-4 md:px-6">
        <Button asChild variant="outline" className="self-end">
          <a href={labels.calendarGoogleUrl} target="_blank" rel="noreferrer">
            {labels.openInGoogleLabel}
          </a>
        </Button>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link {...monthLink} search={{ maand: monthOf(agenda.today) }}>
                {labels.todayLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link
                {...monthLink}
                search={{ maand: addMonths(month, -1) }}
                aria-label={labels.previousMonthLabel}
              >
                <ChevronLeft />
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
          </div>
          <h3 className={typography.heading}>{formatMonth(month)}</h3>
        </div>
      </div>

      <div className="bg-powder p-2 md:p-4">
        <div className="overflow-x-auto overscroll-x-contain rounded-lg bg-card shadow-subtle">
          <div className="grid min-w-205 grid-cols-7">
            {labels.weekdays.map((weekday) => (
              <div
                key={weekday}
                className={cn(
                  typography.small,
                  "border-b border-chalk bg-eggshell px-2 py-3 text-center text-gravel",
                )}
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
        </div>
      </div>
    </div>
  );
}
