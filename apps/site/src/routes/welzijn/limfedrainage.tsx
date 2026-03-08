import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";

export const Route = createFileRoute("/welzijn/limfedrainage")({
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
