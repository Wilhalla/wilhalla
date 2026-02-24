import { createFileRoute } from "@tanstack/react-router"
import { ContentPage } from "@/components/content-page"
import { Breadcrumb } from "@/components/breadcrumb"

export const Route = createFileRoute("/welzijn/fasciatherapie")({ component: FasciatherapiePage })

function FasciatherapiePage() {
  return (
    <ContentPage
      title="Fasciatherapie"
      intro="Een methode die zijn doeltreffendheid haalt uit de zachtheid van de behandeling. We vertrekken vanuit een holistische kijk op het lichaam."
      breadcrumb={<Breadcrumb items={[{ label: "Welzijn", to: "/welzijn" }, { label: "Fasciatherapie" }]} />}
      sections={[
        {
          title: "Aanbod",
          content: <p>Placeholder — beschrijving van fasciatherapie aanbod.</p>,
        },
        {
          title: "Info",
          content: <p>Placeholder — praktische informatie, tarieven, planning.</p>,
        },
      ]}
      contact={{
        name: "Tinneke Willaeys & Jasmien Dhondt",
      }}
    />
  )
}
