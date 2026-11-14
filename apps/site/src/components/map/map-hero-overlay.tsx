import { Link } from "@tanstack/react-router";
import { Button } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { allHomepages } from "content-collections";

const [homepage] = allHomepages;

if (!homepage) {
  throw new Error("Missing homepage content: src/content/homepage.md");
}

/** Title and tagline beside the map; on small screens only the heading remains, for screen readers. */
export function MapHeroOverlay() {
  return (
    <section
      className="pointer-events-none absolute top-1/5 left-1/5 z-20 w-1/3 max-w-lg text-left max-lg:sr-only"
      aria-labelledby="map-hero-title"
    >
      <h1 id="map-hero-title" className={cn(typography.display, "text-map-ink")}>
        Wilhalla
      </h1>
      <p className={cn(typography.lead, "mt-3 max-w-sm text-balance text-map-ink-soft")}>
        {homepage.tagline}
      </p>
      <Button asChild className="pointer-events-auto mt-5 max-lg:hidden">
        <Link to="/over-ons">Ontdek Wilhalla</Link>
      </Button>
    </section>
  );
}
