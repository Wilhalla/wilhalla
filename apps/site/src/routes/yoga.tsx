import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/yoga")({ component: YogaPage });

function YogaPage() {
  return (
    <div>
      <PageHeader title="Yoga" intro="Placeholder — yoga aanbod en planning." />
    </div>
  );
}
