import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/limfedrainage")({
  head: () => ({
    meta: routeMeta({
      title: "Limfedrainage",
      description: "Limfedrainage bij Wilhalla.",
    }),
  }),
  component: LimfdrainagePage,
});

function LimfdrainagePage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Welzijn", to: "/welzijn" },
          { label: "Limfedrainage" },
        ]}
      />
      <PageHeader
        title="Limfedrainage"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  );
}
