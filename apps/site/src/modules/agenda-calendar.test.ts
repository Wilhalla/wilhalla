import { describe, expect, it } from "vitest";
import {
  createAgendaMonth,
  formatAgendaEventTime,
  getDayKey,
  getInitialAgendaMonth,
  getUpcomingAgendaEvents,
  parseAgendaIcsEvents,
  startOfDay,
} from "./agenda-calendar";

const ICS = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:later@example.com
DTSTART:20260615T183000Z
DTEND:20260615T200000Z
SUMMARY:Yoga in de yurt
LOCATION:Wilhalla
DESCRIPTION:Meer info https://example.com/event
END:VEVENT
BEGIN:VEVENT
UID:all-day@example.com
DTSTART;VALUE=DATE:20260610
DTEND;VALUE=DATE:20260611
SUMMARY:Oogstfeest &amp; samenkomst
END:VEVENT
END:VCALENDAR`;

describe("Agenda calendar intake", () => {
  it("parses Google Calendar ICS events into Agenda events", () => {
    const events = parseAgendaIcsEvents(ICS);

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      id: "all-day@example.com",
      title: "Oogstfeest & samenkomst",
      allDay: true,
    });
    expect(events[1]).toMatchObject({
      id: "later@example.com",
      location: "Wilhalla",
      url: "https://example.com/event",
    });
  });

  it("derives upcoming events and initial month behind one interface", () => {
    const events = parseAgendaIcsEvents(ICS);
    const today = startOfDay(new Date(2026, 5, 12));

    expect(
      getUpcomingAgendaEvents(events, today).map((event) => event.id),
    ).toEqual(["later@example.com"]);
    expect(getInitialAgendaMonth(events, today)).toEqual(new Date(2026, 5, 1));
  });

  it("groups multi-day calendar cells by day", () => {
    const events = parseAgendaIcsEvents(ICS);
    const { days, eventsByDay } = createAgendaMonth(
      events,
      new Date(2026, 5, 1),
    );

    expect(days[0]).toEqual(new Date(2026, 5, 1));
    expect(eventsByDay.get("2026-06-10")?.[0]?.id).toBe("all-day@example.com");
  });

  it("keeps formatting rules in the Agenda module", () => {
    const event = parseAgendaIcsEvents(ICS)[1];

    expect(getDayKey(new Date(2026, 5, 15))).toBe("2026-06-15");
    expect(formatAgendaEventTime(event)).toMatch(/\d{2}:\d{2}/);
  });
});
