import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tuin/samentuin")({
  head: () => ({
    meta: routeMeta({
      title: "Samentuin",
      description: "Samentuin bij Wilhalla.",
    }),
  }),
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
