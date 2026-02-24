import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb } from "@/components/breadcrumb"

export const Route = createFileRoute("/welzijn/veerkracht")({ component: VeerkrachtPage })

function VeerkrachtPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Welzijn", to: "/welzijn" }, { label: "Veerkracht in Beweging" }]} />
      <PageHeader
        title="Veerkracht in Beweging"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  )
}
