import { MonthCalendar } from "@/components/agenda/month-calendar";
import { UpcomingEvents } from "@/components/agenda/upcoming-events";
import { MarkdownContent } from "@/components/markdown-content";
import { getPage } from "@/content/pages";
import { initialMonth, upcomingEvents } from "@/modules/agenda-calendar";
import { getRouteApi } from "@tanstack/react-router";
import { PageBody } from "@wilhalla/ui/components/page-body";
import { PageHeader } from "@wilhalla/ui/components/page-header";

const route = getRouteApi("/agenda");
const page = getPage("agenda");

export function AgendaPage() {
  const agenda = route.useLoaderData();
  const { maand } = route.useSearch();

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <PageBody>
        <MarkdownContent html={page.html} />
        <div className="mt-12 flex flex-col gap-6">
          <UpcomingEvents events={upcomingEvents(agenda)} />
          <MonthCalendar agenda={agenda} month={maand ?? initialMonth(agenda)} />
        </div>
      </PageBody>
    </>
  );
}
