import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/yoga")({
  head: () => ({
    meta: routeMeta({
      title: "Yoga",
      description: "Yoga aanbod en planning bij Wilhalla.",
    }),
  }),
  component: YogaPage,
});

function YogaPage() {
  return (
    <div>
      <PageHeader title="Yoga" intro="Placeholder — yoga aanbod en planning." />
    </div>
  );
}
