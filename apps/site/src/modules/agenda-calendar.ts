import { siteConfig } from "@/config";

const agenda = siteConfig.agenda;

/**
 * A calendar date and a calendar month in the agenda's time zone. Events are converted to these
 * once, on the server, so no later step depends on the time zone of the machine that runs it.
 * Both compare correctly as strings.
 */
export type Day = `${number}-${number}-${number}`;
export type Month = `${number}-${number}`;

export interface AgendaEvent {
  id: string;
  title: string;
  location: string;
  url?: string;
  firstDay: Day;
  lastDay: Day;
  /** Wall-clock start, "HH:MM"; absent for an all-day event. */
  startTime?: string;
}

export interface Agenda {
  events: AgendaEvent[];
  today: Day;
}

const DAY_MS = 86_400_000;
/** Recurring events are expanded from a year back to two years ahead of today. */
const RECURRENCE_DAYS_BACK = 366;
const RECURRENCE_DAYS_AHEAD = 731;
const MAX_RECURRENCE_STEPS = 5000;
const WEEKDAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

// --- Days and months ---------------------------------------------------------------------------

function isDay(value: string): value is Day {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isMonth(value: string): value is Month {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function parseMonth(value: unknown): Month | undefined {
  return typeof value === "string" && isMonth(value) ? value : undefined;
}

function dayAt(instantMs: number): Day {
  const day = new Date(instantMs).toISOString().slice(0, 10);

  if (!isDay(day)) {
    throw new RangeError(`Not a calendar date: ${instantMs}`);
  }

  return day;
}

function utcMs(day: Day) {
  return Date.parse(`${day}T00:00:00Z`);
}

function addDays(day: Day, days: number) {
  return dayAt(utcMs(day) + days * DAY_MS);
}

function daysBetween(from: Day, to: Day) {
  return Math.round((utcMs(to) - utcMs(from)) / DAY_MS);
}

/** 0 for Monday to 6 for Sunday. */
function weekdayIndex(day: Day) {
  return (new Date(utcMs(day)).getUTCDay() + 6) % 7;
}

export function monthOf(day: Day): Month {
  const month = day.slice(0, 7);

  if (!isMonth(month)) {
    throw new RangeError(`Not a calendar date: ${day}`);
  }

  return month;
}

export function addMonths(month: Month, months: number) {
  const [year, monthNumber] = month.split("-").map(Number);

  return monthOf(dayAt(Date.UTC(year, monthNumber - 1 + months, 1)));
}

export function dayOfMonth(day: Day) {
  return Number(day.slice(8));
}

/** The weeks that show `month`, Monday to Sunday, including the days of neighbouring months. */
export function monthGridDays(month: Month) {
  const first: Day = `${month}-01`;
  const last = addDays(`${addMonths(month, 1)}-01`, -1);
  const start = addDays(first, -weekdayIndex(first));
  const length = daysBetween(start, last) + 7 - weekdayIndex(last);

  return Array.from({ length }, (_, index) => addDays(start, index));
}

// --- Time zones --------------------------------------------------------------------------------

interface WallTime {
  day: Day;
  time: string;
}

function wallTimeIn(timeZone: string, instantMs: number): WallTime {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instantMs);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";
  const day = `${part("year")}-${part("month")}-${part("day")}`;

  if (!isDay(day)) {
    throw new RangeError(`Cannot place ${instantMs} in ${timeZone}`);
  }

  return { day, time: `${part("hour")}:${part("minute")}` };
}

function wallTimeAsUtcMs({ day, time }: WallTime) {
  return Date.parse(`${day}T${time}:00Z`);
}

/** The instant at which the clocks in `timeZone` show `wallTime`. */
function instantOf(wallTime: WallTime, timeZone: string) {
  const guess = wallTimeAsUtcMs(wallTime);
  const offset = wallTimeAsUtcMs(wallTimeIn(timeZone, guess)) - guess;

  return guess - offset;
}

export function todayInAgendaZone(now = Date.now()) {
  return wallTimeIn(agenda.calendarTimezone, now).day;
}

// --- iCalendar ---------------------------------------------------------------------------------

interface IcsProperty {
  name: string;
  params: string[];
  value: string;
}

type IcsMoment = { allDay: true; day: Day } | ({ allDay: false } & WallTime);

function parseIcsMoment({ value, params }: IcsProperty): IcsMoment | undefined {
  const day = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;

  if (!isDay(day)) {
    return undefined;
  }

  if (value.length === 8) {
    return { allDay: true, day };
  }

  const wallTime = { day, time: `${value.slice(9, 11)}:${value.slice(11, 13)}` };
  const timeZone = value.endsWith("Z")
    ? "UTC"
    : params.find((param) => param.toUpperCase().startsWith("TZID="))?.slice(5);

  if (!timeZone || timeZone === agenda.calendarTimezone) {
    return { allDay: false, ...wallTime };
  }

  try {
    return {
      allDay: false,
      ...wallTimeIn(agenda.calendarTimezone, instantOf(wallTime, timeZone)),
    };
  } catch {
    // An unknown TZID: read the time as the agenda's own wall clock.
    return { allDay: false, ...wallTime };
  }
}

function parseIcsProperties(lines: string[]) {
  return lines.flatMap((line): IcsProperty[] => {
    const separator = line.indexOf(":");

    if (separator === -1) {
      return [];
    }

    const [name, ...params] = line.slice(0, separator).split(";");

    return [{ name: name.toUpperCase(), params, value: line.slice(separator + 1) }];
  });
}

function cleanIcsText(value: string) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\([,;\\])/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extractUrl(text: string) {
  const url = text.match(/https?:\/\/\S+/)?.[0];

  if (!url || !URL.canParse(url)) {
    return url;
  }

  // Google wraps links in descriptions as google.com/url?q=<target>.
  return new URL(url).searchParams.get("q") ?? url;
}

interface IcsEvent {
  uid: string;
  event: Omit<AgendaEvent, "id">;
  rule?: string;
  excludedDays: Day[];
  /** Set on an event that replaces one occurrence of the recurring event with the same UID. */
  replacesDay?: Day;
}

function parseIcsEvent(lines: string[]): IcsEvent | undefined {
  const properties = parseIcsProperties(lines);
  const find = (name: string) => properties.find((property) => property.name === name);
  const text = (name: string) => cleanIcsText(find(name)?.value ?? "");
  const startProperty = find("DTSTART");
  const start = startProperty && parseIcsMoment(startProperty);

  if (!start) {
    return undefined;
  }

  const endProperty = find("DTEND");
  const end = endProperty && parseIcsMoment(endProperty);
  // DTEND is exclusive: an all-day event ends the day before it, and so does a timed event that
  // ends at midnight.
  const endsBeforeDay = end && (end.allDay || end.time === "00:00") && end.day > start.day;
  const lastDay = end ? (endsBeforeDay ? addDays(end.day, -1) : end.day) : start.day;
  const recurrenceId = find("RECURRENCE-ID");

  return {
    uid: text("UID") || `${start.day}-${text("SUMMARY")}`,
    event: {
      title: text("SUMMARY") || agenda.defaultEventTitle,
      location: text("LOCATION"),
      url: extractUrl(text("DESCRIPTION")),
      firstDay: start.day,
      lastDay: lastDay < start.day ? start.day : lastDay,
      startTime: start.allDay ? undefined : start.time,
    },
    rule: find("RRULE")?.value,
    excludedDays: properties
      .filter((property) => property.name === "EXDATE")
      .flatMap((property) =>
        property.value.split(",").flatMap((value) => {
          const moment = parseIcsMoment({ ...property, value });
          return moment ? [moment.day] : [];
        }),
      ),
    replacesDay: recurrenceId && parseIcsMoment(recurrenceId)?.day,
  };
}

/**
 * The first days of the occurrences of a recurring event that start between `from` and `to`.
 * Covers what calendar apps produce for simple repeats (daily, weekly on chosen weekdays,
 * monthly and yearly on the same date; INTERVAL, COUNT, UNTIL). A rule with anything else
 * yields only the first occurrence, never a guessed date.
 */
function occurrenceDays(first: Day, rule: string | undefined, from: Day, to: Day) {
  if (!rule) {
    return [first];
  }

  const parts = new Map(
    rule.split(";").map((part): [string, string] => {
      const [key, value = ""] = part.split("=");
      return [key.toUpperCase(), value.toUpperCase()];
    }),
  );
  const frequency = parts.get("FREQ");
  const interval = Number(parts.get("INTERVAL") ?? 1);
  const count = Number(parts.get("COUNT") ?? Number.POSITIVE_INFINITY);
  const untilValue = parts.get("UNTIL");
  const until = untilValue
    ? parseIcsMoment({ name: "UNTIL", params: [], value: untilValue })
    : undefined;
  const weekdays = parts
    .get("BYDAY")
    ?.split(",")
    .map((code) => WEEKDAY_CODES.indexOf(code));
  const supportedKeys = ["FREQ", "INTERVAL", "COUNT", "UNTIL", "WKST", "BYDAY"];
  const supported =
    ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(frequency ?? "") &&
    [...parts.keys()].every((key) => supportedKeys.includes(key)) &&
    Number.isInteger(interval) &&
    interval > 0 &&
    (weekdays === undefined || (frequency === "WEEKLY" && !weekdays.includes(-1))) &&
    // A week that starts on another day than Monday only matters for intervals above one.
    (interval === 1 || (parts.get("WKST") ?? "MO") === "MO");

  if (!supported) {
    return [first];
  }

  const [year, month, date] = first.split("-").map(Number);
  const weekStart = addDays(first, -weekdayIndex(first));
  const candidatesAt = (step: number): Day[] => {
    switch (frequency) {
      case "DAILY":
        return [addDays(first, step * interval)];
      case "WEEKLY":
        return (weekdays ?? [weekdayIndex(first)])
          .toSorted((left, right) => left - right)
          .map((weekday) => addDays(weekStart, step * interval * 7 + weekday));
      case "MONTHLY":
      case "YEARLY": {
        const months = frequency === "YEARLY" ? 12 : 1;
        const day = dayAt(Date.UTC(year, month - 1 + step * interval * months, date));
        // A date that month does not have (31 April, 29 February) is skipped.
        return dayOfMonth(day) === date ? [day] : [];
      }
      default:
        return [];
    }
  };

  const days: Day[] = [];
  let found = 0;

  for (let step = 0; step < MAX_RECURRENCE_STEPS && found < count; step += 1) {
    const candidates = candidatesAt(step).filter((day) => day >= first);

    for (const day of candidates) {
      if (day > to || (until && day > until.day)) {
        return days;
      }

      found += 1;

      if (found <= count && day >= from) {
        days.push(day);
      }
    }
  }

  return days;
}

export function parseAgendaIcsEvents(ics: string, today = todayInAgendaZone()): AgendaEvent[] {
  const parsed = ics
    .replace(/\r?\n[ \t]/g, "")
    .split("BEGIN:VEVENT")
    .slice(1)
    .flatMap((block) => parseIcsEvent(block.split("END:VEVENT")[0].split(/\r?\n/)) ?? []);
  const from = addDays(today, -RECURRENCE_DAYS_BACK);
  const to = addDays(today, RECURRENCE_DAYS_AHEAD);

  return parsed
    .flatMap(({ uid, event, rule, excludedDays, replacesDay }): AgendaEvent[] => {
      if (replacesDay) {
        return [{ ...event, id: `${uid}:${replacesDay}` }];
      }

      const replacedDays = parsed.flatMap((other) =>
        other.uid === uid && other.replacesDay ? [other.replacesDay] : [],
      );
      const span = daysBetween(event.firstDay, event.lastDay);

      return occurrenceDays(event.firstDay, rule, from, to)
        .filter((day) => !excludedDays.includes(day) && !replacedDays.includes(day))
        .map((day) => ({
          ...event,
          id: rule ? `${uid}:${day}` : uid,
          firstDay: day,
          lastDay: addDays(day, span),
        }));
    })
    .toSorted(
      (left, right) =>
        left.firstDay.localeCompare(right.firstDay) ||
        (left.startTime ?? "").localeCompare(right.startTime ?? ""),
    );
}

/** Throws when the feed cannot be read: an empty agenda and a broken feed are different states. */
export async function fetchAgenda(fetcher: typeof fetch = fetch): Promise<Agenda> {
  const response = await fetcher(agenda.calendarIcsUrl, { headers: { accept: "text/calendar" } });

  if (!response.ok) {
    throw new Error(`Google Calendar feed failed: ${response.status}`);
  }

  const today = todayInAgendaZone();

  return { events: parseAgendaIcsEvents(await response.text(), today), today };
}

// --- Queries and formatting --------------------------------------------------------------------

export function upcomingEvents({ events, today }: Agenda) {
  return events.filter((event) => event.lastDay >= today);
}

/** The month to open the calendar on: that of the next event, else the current one. */
export function initialMonth(agendaData: Agenda) {
  return monthOf(upcomingEvents(agendaData)[0]?.firstDay ?? agendaData.today);
}

export function eventsOn(events: AgendaEvent[], day: Day) {
  return events.filter((event) => event.firstDay <= day && day <= event.lastDay);
}

function formatDay(day: Day, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(agenda.locale, { ...options, timeZone: "UTC" }).format(utcMs(day));
}

export function formatMonth(month: Month) {
  return formatDay(`${month}-01`, { month: "long", year: "numeric" });
}

/** "za 14": a day inside a month that is already named. */
export function formatDayLabel(day: Day) {
  return formatDay(day, { weekday: "short", day: "numeric" });
}

export function formatEventDate({ firstDay, startTime }: AgendaEvent) {
  const date = formatDay(firstDay, { weekday: "short", day: "numeric", month: "long" });

  return startTime ? `${date} · ${startTime}` : date;
}
