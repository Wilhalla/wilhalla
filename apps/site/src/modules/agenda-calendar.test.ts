import { describe, expect, it } from "vitest";
import {
  addMonths,
  eventsOn,
  fetchAgenda,
  formatEventDate,
  formatMonth,
  initialMonth,
  monthGridDays,
  parseAgendaIcsEvents,
  parseMonth,
  todayInAgendaZone,
  upcomingEvents,
} from "./agenda-calendar";

const TODAY = "2026-06-12";

function ics(...events: string[]) {
  return `BEGIN:VCALENDAR\n${events.map((event) => `BEGIN:VEVENT\n${event}\nEND:VEVENT`).join("\n")}\nEND:VCALENDAR`;
}

const yoga = `UID:yoga@example.com
DTSTART:20260615T183000Z
DTEND:20260615T200000Z
SUMMARY:Yoga in de yurt
LOCATION:Wilhalla
DESCRIPTION:Meer info https://example.com/event`;

const feast = `UID:feast@example.com
DTSTART;VALUE=DATE:20260610
DTEND;VALUE=DATE:20260611
SUMMARY:Oogstfeest &amp; samenkomst`;

describe("agenda calendar", () => {
  it("reads events in the agenda's time zone, whatever the machine's own", () => {
    const events = parseAgendaIcsEvents(ics(yoga, feast), TODAY);

    expect(events).toEqual([
      {
        id: "feast@example.com",
        title: "Oogstfeest & samenkomst",
        location: "",
        url: undefined,
        firstDay: "2026-06-10",
        lastDay: "2026-06-10",
        startTime: undefined,
      },
      {
        id: "yoga@example.com",
        title: "Yoga in de yurt",
        location: "Wilhalla",
        url: "https://example.com/event",
        firstDay: "2026-06-15",
        lastDay: "2026-06-15",
        startTime: "20:30",
      },
    ]);
  });

  it("puts a late UTC start on the next Brussels day", () => {
    const [event] = parseAgendaIcsEvents(
      ics("UID:late\nDTSTART:20260615T223000Z\nDTEND:20260615T233000Z\nSUMMARY:Nachtwandeling"),
      TODAY,
    );

    expect(event).toMatchObject({
      firstDay: "2026-06-16",
      lastDay: "2026-06-16",
      startTime: "00:30",
    });
  });

  it("keeps the wall-clock time of an event with a TZID and converts other zones", () => {
    const events = parseAgendaIcsEvents(
      ics(
        "UID:local\nDTSTART;TZID=Europe/Brussels:20260620T100000\nSUMMARY:Lokaal",
        "UID:lisbon\nDTSTART;TZID=Europe/Lisbon:20260621T100000\nSUMMARY:Lissabon",
      ),
      TODAY,
    );

    expect(events.map((event) => event.startTime)).toEqual(["10:00", "11:00"]);
  });

  it("shows an all-day event only on its own days", () => {
    const events = parseAgendaIcsEvents(ics(feast), TODAY);

    expect(eventsOn(events, "2026-06-10")).toHaveLength(1);
    expect(eventsOn(events, "2026-06-11")).toHaveLength(0);
  });

  it("expands a weekly repeat, without excluded and replaced occurrences", () => {
    const events = parseAgendaIcsEvents(
      ics(
        "UID:weekly\nDTSTART;TZID=Europe/Brussels:20260601T190000\nDTEND;TZID=Europe/Brussels:20260601T200000\nRRULE:FREQ=WEEKLY;BYDAY=MO,TH;COUNT=6\nEXDATE;TZID=Europe/Brussels:20260604T190000\nSUMMARY:Yoga",
        "UID:weekly\nRECURRENCE-ID;TZID=Europe/Brussels:20260608T190000\nDTSTART;TZID=Europe/Brussels:20260609T200000\nSUMMARY:Yoga (verplaatst)",
      ),
      TODAY,
    );

    expect(events.map((event) => [event.firstDay, event.startTime, event.title])).toEqual([
      ["2026-06-01", "19:00", "Yoga"],
      ["2026-06-09", "20:00", "Yoga (verplaatst)"],
      ["2026-06-11", "19:00", "Yoga"],
      ["2026-06-15", "19:00", "Yoga"],
      ["2026-06-18", "19:00", "Yoga"],
    ]);
  });

  it("repeats monthly on the same date and stops at UNTIL", () => {
    const events = parseAgendaIcsEvents(
      ics(
        "UID:m\nDTSTART;VALUE=DATE:20260531\nRRULE:FREQ=MONTHLY;UNTIL=20260901\nSUMMARY:Maandmarkt",
      ),
      TODAY,
    );

    expect(events.map((event) => event.firstDay)).toEqual([
      "2026-05-31",
      "2026-07-31",
      "2026-08-31",
    ]);
  });

  it("shows only the first occurrence of a repeat it cannot expand", () => {
    const events = parseAgendaIcsEvents(
      ics(
        "UID:x\nDTSTART;VALUE=DATE:20260602\nRRULE:FREQ=MONTHLY;BYDAY=1TU\nSUMMARY:Eerste dinsdag",
      ),
      TODAY,
    );

    expect(events.map((event) => event.firstDay)).toEqual(["2026-06-02"]);
  });

  it("derives the upcoming events and the month to open on", () => {
    const agenda = { events: parseAgendaIcsEvents(ics(yoga, feast), TODAY), today: TODAY } as const;

    expect(upcomingEvents(agenda).map((event) => event.id)).toEqual(["yoga@example.com"]);
    expect(initialMonth(agenda)).toBe("2026-06");
    expect(initialMonth({ events: [], today: "2026-12-31" })).toBe("2026-12");
  });

  it("lays a month out in whole weeks from Monday", () => {
    const days = monthGridDays("2026-06");

    expect(days[0]).toBe("2026-06-01");
    expect(days.at(-1)).toBe("2026-07-05");
    expect(days).toHaveLength(35);
    expect(monthGridDays("2021-02")).toHaveLength(28);
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });

  it("formats in Dutch and accepts only real months from the URL", () => {
    const [event] = parseAgendaIcsEvents(ics(yoga), TODAY);

    expect(formatMonth("2026-06")).toBe("juni 2026");
    expect(formatEventDate(event)).toBe("ma 15 juni · 20:30");
    expect(parseMonth("2026-06")).toBe("2026-06");
    expect(parseMonth("2026-13")).toBeUndefined();
    expect(parseMonth(6)).toBeUndefined();
  });

  it("knows today in Brussels around midnight UTC", () => {
    expect(todayInAgendaZone(Date.parse("2026-06-12T22:30:00Z"))).toBe("2026-06-13");
    expect(todayInAgendaZone(Date.parse("2026-01-12T22:30:00Z"))).toBe("2026-01-12");
  });

  it("fails loudly when the feed cannot be read", async () => {
    await expect(fetchAgenda(async () => new Response("", { status: 503 }))).rejects.toThrow("503");
  });
});
