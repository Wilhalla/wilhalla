import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/breadcrumb";

export const Route = createFileRoute("/tuin/samentuin")({
  component: SamentuinPage,
});

function SamentuinPage() {
  return (
    <div>
      <Breadcrumb
        items={[{ label: "Tuin", to: "/tuin" }, { label: "Samentuin" }]}
      />
      <PageHeader
        title="Samentuin"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  );
}
