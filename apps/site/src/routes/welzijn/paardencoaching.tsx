import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb } from "@/components/breadcrumb"

export const Route = createFileRoute("/welzijn/paardencoaching")({ component: PaardencoachingPage })

function PaardencoachingPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Welzijn", to: "/welzijn" }, { label: "Paardencoaching" }]} />
      <PageHeader
        title="Paardencoaching"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  )
}
