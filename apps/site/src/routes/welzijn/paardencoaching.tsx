import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/paardencoaching")({
  head: () => ({
    meta: routeMeta({
      title: "Paardencoaching",
      description: "Paardencoaching bij Wilhalla.",
    }),
  }),
  component: PaardencoachingPage,
});

function PaardencoachingPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Welzijn", to: "/welzijn" },
          { label: "Paardencoaching" },
        ]}
      />
      <PageHeader
        title="Paardencoaching"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  );
}
