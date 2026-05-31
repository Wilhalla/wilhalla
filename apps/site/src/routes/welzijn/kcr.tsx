import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/kcr")({
  head: () => ({
    meta: routeMeta({
      title: "Kinetic Chain Release",
      description: "Kinetic Chain Release bij Wilhalla.",
    }),
  }),
  component: KcrPage,
});

function KcrPage() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Welzijn", to: "/welzijn" },
          { label: "Kinetic Chain Release" },
        ]}
      />
      <PageHeader
        title="Kinetic Chain Release"
        intro="Placeholder — content wordt later aangevuld."
      />
    </div>
  );
}
