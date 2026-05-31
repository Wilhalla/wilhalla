import { InteractiveMap } from "@/components/map/interactive-map";
import { routeMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: routeMeta() }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <InteractiveMap />
    </div>
  );
}
