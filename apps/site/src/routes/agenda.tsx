import { type Month, fetchAgenda, parseMonth } from "@/modules/agenda-calendar";
import { AgendaErrorPage } from "@/pages/agenda-error-page";
import { AgendaPage } from "@/pages/agenda-page";
import { pageHead } from "@/pages/editorial-route";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getAgenda = createServerFn({ method: "GET" }).handler(() => fetchAgenda());

export const Route = createFileRoute("/agenda")({
  /** `?maand=2026-06` selects the visible month; without it the calendar opens on the next event. */
  validateSearch: (search): { maand?: Month } => ({ maand: parseMonth(search.maand) }),
  loader: () => getAgenda(),
  head: () => pageHead("agenda"),
  component: AgendaPage,
  errorComponent: AgendaErrorPage,
});
