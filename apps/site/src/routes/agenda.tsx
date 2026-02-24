import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"

export const Route = createFileRoute("/agenda")({ component: AgendaPage })

function AgendaPage() {
  return (
    <div>
      <PageHeader
        title="Agenda"
        intro="Workshops, activiteiten en evenementen op Wilhalla."
      />
    </div>
  )
}
