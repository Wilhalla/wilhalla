import { PageHeader } from "@/components/page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agenda")({ component: AgendaPage });

function AgendaPage() {
  return (
    <div>
      <PageHeader
        title="Agenda"
        intro="Workshops, activiteiten en evenementen op Wilhalla."
      />

      <section className="mx-auto max-w-300 px-6 py-6">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=nl.be%23holiday%40group.v.calendar.google.com&ctz=Europe%2FBrussels"
          title="Wilhalla agenda"
          className="w-full border border-border"
          style={{ height: 600 }}
        />
      </section>
    </div>
  );
}
