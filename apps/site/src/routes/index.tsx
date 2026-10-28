import { InteractiveMap } from "@/components/map/interactive-map";
import { routeHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => routeHead({ path: "/" }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <InteractiveMap />
    </div>
  );
}
