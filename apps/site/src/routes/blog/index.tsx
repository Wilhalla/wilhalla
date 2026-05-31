import { PageHeader } from "@/components/page-header";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: routeMeta({
      title: "Blog",
      description: "Verhalen en updates van Wilhalla.",
    }),
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div>
      <PageHeader title="Blog" intro="Verhalen en updates van Wilhalla." />
    </div>
  );
}
