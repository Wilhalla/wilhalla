import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verhuur")({
  head: () => ({
    meta: routeMeta({
      title: "Verhuur",
      description: "De schuur en yurt van Wilhalla zijn beschikbaar voor verhuur.",
    }),
  }),
  component: VerhuurPage,
});

function VerhuurPage() {
  return (
    <div>
      <PageHeader
        title="Verhuur"
        intro="De schuur en yurt zijn beschikbaar voor verhuur."
      />
    </div>
  );
}
