import { InteractiveMap } from "@/components/map/interactive-map";
import { routeHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

// PROTOTYPE (site/prototype/homepage-map): ?variant= switches between homepage variants.
import { PrototypeSwitcher } from "@/components/home-prototype/switcher";
import { VariantPins, name as pinsName } from "@/components/home-prototype/variant-pins";
import { VariantStory, name as storyName } from "@/components/home-prototype/variant-story";
import { VariantTour, name as tourName } from "@/components/home-prototype/variant-tour";

const variants = [
  { key: "0", name: "Huidige kaart" },
  { key: "A", name: pinsName },
  { key: "B", name: tourName },
  { key: "C", name: storyName },
];

export const Route = createFileRoute("/")({
  head: () => routeHead({ path: "/" }),
  validateSearch: (search: Record<string, unknown>): { variant?: string } => ({
    variant: typeof search.variant === "string" ? search.variant : undefined,
  }),
  component: HomePage,
});

function HomePage() {
  const { variant = "A" } = Route.useSearch();
  return (
    <div>
      {variant === "0" && <InteractiveMap />}
      {variant === "A" && <VariantPins />}
      {variant === "B" && <VariantTour />}
      {variant === "C" && <VariantStory />}
      <PrototypeSwitcher variants={variants} current={variant} />
    </div>
  );
}
