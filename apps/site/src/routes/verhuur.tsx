import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/verhuur")({ component: VerhuurPage });

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
