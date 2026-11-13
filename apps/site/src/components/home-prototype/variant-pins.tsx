// PROTOTYPE (site/prototype/homepage-map), variant A "Spelden": the map stays the hero, every
// place gets a visible, tappable marker. Tap or click opens a card with a link; no autoplay.
import { Button, buttonVariants } from "@wilhalla/ui/components/button";
import { Popover, PopoverAnchor, PopoverContent } from "@wilhalla/ui/components/popover";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { MAP_ASPECT, type Place, placePercent, places } from "./places";

// Places whose name is always shown on desktop; the rest show a number until opened.
const titled = new Set(["horses", "barn", "garden", "yurt"]);
import { MapPicture, PlaceOverlays, useIsDesktop } from "./shared";

export const name = "Spelden op de kaart";

function PlaceCard({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className={typography.heading}>{place.title}</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Sluiten" onClick={onClose}>
          <X />
        </Button>
      </div>
      <p className={cn(typography.small, "m-0 text-cinder")}>{place.text}</p>
      <Link to={place.href} className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>
        {place.linkLabel} <ArrowRight />
      </Link>
    </div>
  );
}

function Marker({
  place,
  index,
  active,
  showTitle,
  onSelect,
}: {
  place: Place;
  index: number;
  active: boolean;
  showTitle: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={place.title}
      title={place.title}
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-90 fill-mode-both",
        "flex min-h-9 items-center gap-1.5 rounded-full bg-pure-surface/95 p-1 font-sans text-small text-obsidian shadow-subtle-4 data-[title=true]:pr-3",
        "transition-transform duration-150 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        "aria-pressed:bg-obsidian aria-pressed:text-eggshell",
      )}
      data-title={showTitle || active}
      style={{ ...placePercent(place), animationDelay: `${300 + index * 60}ms` } as CSSProperties}
    >
      <span className="grid size-7 place-items-center rounded-full bg-powder text-label font-medium text-obsidian">
        {index + 1}
      </span>
      {(showTitle || active) && <span className="whitespace-nowrap">{place.title}</span>}
    </button>
  );
}

function Hero({ className }: { className?: string }) {
  return (
    <section className={className} aria-labelledby="home-title">
      <h1 id="home-title" className={typography.display}>
        Wilhalla
      </h1>
      <p className={cn(typography.intro, "mt-3 max-w-sm")}>
        Tuin, welzijn, yoga en ontmoeting in Halle-Zoersel. Tik op een plek om te ontdekken wat er
        gebeurt.
      </p>
    </section>
  );
}

export function VariantPins() {
  const isDesktop = useIsDesktop();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = places.find((place) => place.id === activeId) ?? null;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mobile: start the scrollable map on the farm, not on its left edge.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && !isDesktop) el.scrollLeft = (el.scrollWidth - el.clientWidth) * 0.55;
  }, [isDesktop]);

  const markers = places.map((place, index) => (
    <Marker
      key={place.id}
      place={place}
      index={index}
      active={place.id === activeId}
      showTitle={isDesktop && titled.has(place.id)}
      onSelect={() => setActiveId(place.id === activeId ? null : place.id)}
    />
  ));

  if (isDesktop) {
    return (
      <div className="relative w-full bg-obsidian pt-12">
        <div className="relative mx-auto max-h-[calc(100svh-3rem)] w-full overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: MAP_ASPECT }}>
            <MapPicture sizes="100vw" />
            <PlaceOverlays places={places} active={activeId} />
            <Popover open={Boolean(active)} onOpenChange={(open) => !open && setActiveId(null)}>
              {active && <PopoverAnchor className="absolute size-1" style={placePercent(active)} />}
              {markers}
              <PopoverContent side="right" align="center" sideOffset={28} className="w-80">
                {active && <PlaceCard place={active} onClose={() => setActiveId(null)} />}
              </PopoverContent>
            </Popover>
            <Hero className="absolute top-[14%] left-[6%] max-w-md rounded-2xl bg-eggshell/85 p-6 shadow-subtle-4 backdrop-blur-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-eggshell pt-12">
      <Hero className="mx-auto w-[calc(100%-2rem)] py-6" />
      <div ref={scrollRef} className="relative h-[68svh] overflow-x-auto overscroll-x-contain">
        <div className="relative h-full" style={{ aspectRatio: MAP_ASPECT }}>
          <MapPicture sizes="120svh" />
          <PlaceOverlays places={places} active={activeId} />
          {markers}
        </div>
      </div>
      <p className={cn(typography.small, "mx-auto w-[calc(100%-2rem)] pt-3 text-gravel")}>
        Veeg opzij over de kaart, of kies een plek:
      </p>
      <ol className="mx-auto flex w-[calc(100%-2rem)] list-none flex-wrap gap-2 p-0 pt-2 pb-28">
        {places.map((place, index) => (
          <li key={place.id}>
            <Button
              size="sm"
              variant={place.id === activeId ? "default" : "outline"}
              onClick={() => setActiveId(place.id)}
            >
              {index + 1}. {place.title}
            </Button>
          </li>
        ))}
      </ol>
      {active && (
        <div className="fixed inset-x-3 bottom-3 z-30 animate-in rounded-2xl bg-pure-surface p-4 shadow-subtle-4 slide-in-from-bottom-4 fade-in">
          <PlaceCard place={active} onClose={() => setActiveId(null)} />
        </div>
      )}
    </div>
  );
}
