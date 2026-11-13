// PROTOTYPE (site/prototype/homepage-map), variant B "Rondleiding": the visitor drives a tour.
// Picking a place (list on desktop, swipeable cards on mobile) glides the map to it and paints
// its highlight. Nothing moves until the visitor asks; the first stop is the whole domain.
import { buttonVariants } from "@wilhalla/ui/components/button";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { MAP_HEIGHT, MAP_WIDTH, type Place, mainPlaces, places } from "./places";
import { MapPicture, PlaceOverlays, useIsDesktop } from "./shared";

export const name = "Rondleiding";

const stops = [...mainPlaces, ...places.filter((place) => !mainPlaces.includes(place))];

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

/** Scale and offset that show `place` (or the whole map) centred in a viewport of `size`. */
function camera(place: Place | null, size: { width: number; height: number }) {
  const cover = Math.max(size.width / MAP_WIDTH, size.height / MAP_HEIGHT);
  if (!place || size.width === 0) {
    return {
      scale: cover,
      x: (size.width - MAP_WIDTH * cover) / 2,
      y: (size.height - MAP_HEIGHT * cover) / 2,
    };
  }
  const { x1, y1, x2, y2 } = place.box;
  const fit = Math.min(size.width / ((x2 - x1) * 3), size.height / ((y2 - y1) * 3));
  const scale = Math.min(Math.max(fit, cover * 1.3), cover * 2.4);
  const clamp = (value: number, min: number) => Math.min(0, Math.max(min, value));
  return {
    scale,
    x: clamp(size.width / 2 - ((x1 + x2) / 2) * scale, size.width - MAP_WIDTH * scale),
    y: clamp(size.height / 2 - ((y1 + y2) / 2) * scale, size.height - MAP_HEIGHT * scale),
  };
}

function MapCamera({ active }: { active: Place | null }) {
  const [ref, size] = useSize<HTMLDivElement>();
  const { scale, x, y } = camera(active, size);
  return (
    <div ref={ref} className="relative size-full overflow-hidden bg-obsidian">
      <div
        className="absolute top-0 left-0 origin-top-left transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={
          {
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          } as CSSProperties
        }
      >
        <MapPicture sizes="200vw" />
        <PlaceOverlays places={places} active={active?.id ?? null} />
      </div>
    </div>
  );
}

function StopText({ place }: { place: Place }) {
  return (
    <>
      <h2 className={typography.heading}>{place.title}</h2>
      <p className={cn(typography.small, "m-0 text-cinder")}>{place.text}</p>
      <Link
        to={place.href}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
      >
        {place.linkLabel} <ArrowRight />
      </Link>
    </>
  );
}

function Intro() {
  return (
    <>
      <h1 className={typography.display}>Wilhalla</h1>
      <p className={cn(typography.intro, "m-0")}>
        Tuin, welzijn, yoga en ontmoeting in Halle-Zoersel. Wandel mee over het domein.
      </p>
    </>
  );
}

function DesktopTour() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = stops.find((place) => place.id === activeId) ?? null;
  return (
    <div className="grid h-svh grid-cols-[24rem_1fr] pt-12">
      <aside className="flex flex-col gap-6 overflow-y-auto border-r border-chalk bg-eggshell p-8">
        <Intro />
        <ol className="m-0 grid list-none gap-1 p-0">
          {stops.map((place, index) => (
            <li key={place.id}>
              <button
                type="button"
                aria-current={place.id === activeId}
                onClick={() => setActiveId(place.id === activeId ? null : place.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-sans text-body text-cinder transition-colors hover:bg-powder aria-[current=true]:bg-powder aria-[current=true]:text-obsidian"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-chalk text-label">
                  {index + 1}
                </span>
                {place.title}
              </button>
              {place.id === activeId && (
                <div className="grid animate-in gap-3 px-3 pt-2 pb-4 fade-in slide-in-from-top-1">
                  <StopText place={place} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </aside>
      <MapCamera active={active} />
    </div>
  );
}

function MobileTour() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = stops.find((place) => place.id === activeId) ?? null;
  const stripRef = useRef<HTMLDivElement>(null);

  // The card snapped into view is the active stop.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId((visible.target as HTMLElement).dataset.stop || null);
      },
      { root: strip, threshold: 0.6 },
    );
    for (const card of strip.querySelectorAll("[data-stop]")) observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-svh flex-col bg-eggshell pt-12">
      <div className="min-h-0 flex-1">
        <MapCamera active={active} />
      </div>
      <div
        ref={stripRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none]"
      >
        <article
          data-stop=""
          className="grid w-[85vw] shrink-0 snap-center content-start gap-2 rounded-2xl bg-pure-surface p-5 shadow-subtle-4"
        >
          <Intro />
          <p className={cn(typography.small, "m-0 text-gravel")}>
            Veeg naar links voor de rondleiding →
          </p>
        </article>
        {stops.map((place, index) => (
          <article
            key={place.id}
            data-stop={place.id}
            className="grid w-[85vw] shrink-0 snap-center content-start gap-3 rounded-2xl bg-pure-surface p-5 shadow-subtle-4"
          >
            <span className="font-sans text-label text-gravel">
              {index + 1} / {stops.length}
            </span>
            <StopText place={place} />
          </article>
        ))}
      </div>
    </div>
  );
}

export function VariantTour() {
  return useIsDesktop() ? <DesktopTour /> : <MobileTour />;
}
