import { InteractiveMap } from "@/components/map/interactive-map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div>
      <InteractiveMap />
    </div>
  );
}
