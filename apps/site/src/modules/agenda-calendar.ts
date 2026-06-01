import { agendaRegistry } from "@/config/registries";

export type AgendaEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  url?: string;
};

export function parseAgendaIcsEvents(ics: string): Array<AgendaEvent> {
  const unfolded = ics.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);
  const blocks: Array<Array<string>> = [];
  let current: Array<string> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = [];
      continue;
    }

    if (line === "END:VEVENT") {
      if (current) blocks.push(current);
      current = null;
      continue;
    }

    if (current) current.push(line);
  }

  return blocks
    .map(parseIcsEvent)
    .filter((event): event is AgendaEvent => Boolean(event))
    .sort(
      (left, right) =>
        new Date(left.start).getTime() - new Date(right.start).getTime(),
    );
}

export async function fetchGoogleCalendarAgendaEvents(
  fetcher: typeof fetch = fetch,
): Promise<Array<AgendaEvent>> {
  try {
    const response = await fetcher(agendaRegistry.calendarIcsUrl, {
      headers: { accept: "text/calendar" },
    });

    if (!response.ok) {
      throw new Error(`Google Calendar feed failed: ${response.status}`);
    }

    return parseAgendaIcsEvents(await response.text());
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function sortAgendaEvents(events: Array<AgendaEvent>) {
  return [...events].sort(
    (left, right) =>
      new Date(left.start).getTime() - new Date(right.start).getTime(),
  );
}

export function getUpcomingAgendaEvents(
  events: Array<AgendaEvent>,
  today = startOfDay(new Date()),
) {
  return sortAgendaEvents(events).filter(
    (event) => new Date(event.end || event.start).getTime() >= today.getTime(),
  );
}

export function getInitialAgendaMonth(
  events: Array<AgendaEvent>,
  today = startOfDay(new Date()),
) {
  const upcomingEvents = getUpcomingAgendaEvents(events, today);
  return startOfMonth(new Date(upcomingEvents[0]?.start ?? today));
}

export function createAgendaMonth(
  events: Array<AgendaEvent>,
  visibleMonth: Date,
) {
  const days = getMonthCalendarDays(visibleMonth);
  return {
    days,
    eventsByDay: groupEventsByDay(sortAgendaEvents(events), days),
  };
}

function parseIcsEvent(lines: Array<string>): AgendaEvent | null {
  const fields = new Map<string, { params: Array<string>; value: string }>();

  for (const line of lines) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const rawKey = line.slice(0, separator);
    const [key, ...params] = rawKey.split(";");
    const value = line.slice(separator + 1);
    fields.set(key, { params, value });
  }

  const startField = fields.get("DTSTART");
  if (!startField) return null;

  const endField = fields.get("DTEND");
  const start = parseIcsDate(startField.value, startField.params);
  const end = endField
    ? parseIcsDate(endField.value, endField.params)
    : {
        date: new Date(start.date.getTime() + 60 * 60 * 1000),
        allDay: start.allDay,
      };
  const description = cleanIcsText(fields.get("DESCRIPTION")?.value ?? "");

  return {
    id: cleanIcsText(fields.get("UID")?.value ?? start.date.toISOString()),
    title: cleanIcsText(
      fields.get("SUMMARY")?.value ?? agendaRegistry.defaultEventTitle,
    ),
    description,
    location: cleanIcsText(fields.get("LOCATION")?.value ?? ""),
    start: start.date.toISOString(),
    end: end.date.toISOString(),
    allDay: start.allDay,
    url: extractUrl(description),
  };
}

function parseIcsDate(value: string, params: Array<string>) {
  const allDay = params.some((param) => param.toUpperCase() === "VALUE=DATE");

  if (allDay) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    return { date: new Date(year, month, day), allDay };
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(9, 11) || 0);
  const minute = Number(value.slice(11, 13) || 0);
  const second = Number(value.slice(13, 15) || 0);
  const isUtc = value.endsWith("Z");

  return {
    date: isUtc
      ? new Date(Date.UTC(year, month, day, hour, minute, second))
      : new Date(year, month, day, hour, minute, second),
    allDay,
  };
}

function cleanIcsText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/\\n/g, "\n")
      .replace(/\\,/g, ",")
      .replace(/\\;/g, ";")
      .replace(/\\\\/g, "\\")
      .replace(/<[^>]+>/g, "")
      .trim(),
  );
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractUrl(value: string) {
  const url = value.match(/https?:\/\/\S+/)?.[0];
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const nestedUrl = parsed.searchParams.get("q");
    return nestedUrl ?? url;
  } catch {
    return url;
  }
}

function groupEventsByDay(
  events: Array<AgendaEvent>,
  days: Array<Date>,
): Map<string, Array<AgendaEvent>> {
  const grouped = new Map<string, Array<AgendaEvent>>();

  for (const day of days) {
    const dayStart = startOfDay(day);
    const dayEnd = addDays(dayStart, 1);
    const dayEvents = events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end || event.start);
      return eventStart < dayEnd && eventEnd > dayStart;
    });

    grouped.set(getDayKey(day), dayEvents);
  }

  return grouped;
}

export function getMonthCalendarDays(month: Date) {
  const first = startOfMonth(month);
  const last = endOfMonth(month);
  const start = addDays(first, -getMondayOffset(first));
  const end = addDays(last, 6 - getMondayOffset(last));
  const days: Array<Date> = [];

  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
}

function getMondayOffset(date: Date) {
  return (date.getDay() + 6) % 7;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number) {
  return startOfMonth(
    new Date(date.getFullYear(), date.getMonth() + months, 1),
  );
}

export function isSameDay(left: Date, right: Date) {
  return getDayKey(left) === getDayKey(right);
}

export function getDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function formatAgendaMonth(date: Date) {
  return new Intl.DateTimeFormat(agendaRegistry.locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatAgendaEventDate(event: AgendaEvent) {
  const start = new Date(event.start);
  const date = new Intl.DateTimeFormat(agendaRegistry.locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(start);

  return event.allDay ? date : `${date} · ${formatAgendaEventTime(event)}`;
}

export function formatAgendaEventTime(event: AgendaEvent) {
  const start = new Date(event.start);
  return new Intl.DateTimeFormat(agendaRegistry.locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
}
