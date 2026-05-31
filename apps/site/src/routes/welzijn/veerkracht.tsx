import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/veerkracht")({
  head: () => ({
    meta: routeMeta({
      title: "Veerkracht in Beweging",
      description: "Veerkracht in Beweging bij Wilhalla.",
    }),
  }),
  component: VeerkrachtPage,
});

function VeerkrachtPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Welzijn", to: "/welzijn" },
          { label: "Veerkracht in Beweging" },
        ]}
      />
      <PageHeader
        title="Veerkracht in Beweging"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  );
}
