import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb } from "@/components/breadcrumb"

export const Route = createFileRoute("/welzijn/kcr")({ component: KcrPage })

function KcrPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Welzijn", to: "/welzijn" }, { label: "Kinetic Chain Release" }]} />
      <PageHeader
        title="Kinetic Chain Release"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  )
}
