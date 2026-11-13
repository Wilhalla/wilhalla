// PROTOTYPE (site/prototype/homepage-map), variant C "Verhaal": a calm editorial homepage. The
// map is the opening illustration with small numbered markers; below it every place is a card
// with a painted close-up, its hand-lettered name and a link. Nothing depends on hover.
import { buttonVariants } from "@wilhalla/ui/components/button";
import { Card, CardContent } from "@wilhalla/ui/components/card";
import { Container } from "@wilhalla/ui/components/container";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

import {
  MAP_ASPECT,
  MAP_DETAIL_SRC,
  MAP_HEIGHT,
  MAP_WIDTH,
  type Place,
  placePercent,
  places,
} from "./places";
import { MapPicture } from "./shared";

export const name = "Verhaal met plekken";

/** A close-up of the map around the place, as a CSS background crop. */
function closeUp(place: Place): CSSProperties {
  const { x1, y1, x2, y2 } = place.box;
  // Frame at least 640x480 map pixels around the place, at 4:3.
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const width = Math.max(640, (x2 - x1) * 1.4, ((y2 - y1) * 1.4 * 4) / 3);
  const height = (width * 3) / 4;
  const left = Math.min(Math.max(cx - width / 2, 0), MAP_WIDTH - width);
  const top = Math.min(Math.max(cy - height / 2, 0), MAP_HEIGHT - height);
  return {
    backgroundImage: `url(${MAP_DETAIL_SRC})`,
    backgroundSize: `${(MAP_WIDTH / width) * 100}% auto`,
    backgroundPosition: `${(left / (MAP_WIDTH - width)) * 100}% ${(top / (MAP_HEIGHT - height)) * 100}%`,
  };
}

export function VariantStory() {
  return (
    <div className="bg-eggshell">
      <section className="relative overflow-hidden bg-obsidian pt-12">
        <div
          className="relative mx-auto h-[min(78svh,calc(100vw/var(--map-aspect)))] max-h-[56rem] min-h-[26rem] overflow-hidden"
          style={{ "--map-aspect": MAP_ASPECT } as CSSProperties}
        >
          <div
            className="absolute top-1/2 left-1/2 h-full -translate-x-1/2 -translate-y-1/2"
            style={{ aspectRatio: MAP_ASPECT }}
          >
            <MapPicture sizes="(min-width: 1024px) 100vw, 140vh" />
            {places.map((place, index) => (
              <a
                key={place.id}
                href={`#plek-${place.id}`}
                className="absolute hidden size-8 -translate-x-1/2 md:grid -translate-y-1/2 place-items-center rounded-full bg-pure-surface/95 font-sans text-label font-medium text-obsidian no-underline shadow-subtle-4 transition-transform hover:scale-110"
                style={placePercent(place)}
                aria-label={place.title}
              >
                {index + 1}
              </a>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-obsidian/70 to-transparent pt-24 pb-8">
          <Container className="flex flex-wrap items-end justify-between gap-4 text-eggshell">
            <div>
              <h1 className={cn(typography.display, "text-eggshell")}>Wilhalla</h1>
              <p className={cn(typography.intro, "mt-2 max-w-md text-eggshell/85")}>
                Tuin, welzijn, yoga en ontmoeting in Halle-Zoersel.
              </p>
            </div>
            <a href="#plekken" className={buttonVariants({ variant: "outline" })}>
              Ontdek het domein <ArrowDown />
            </a>
          </Container>
        </div>
      </section>

      <Container asChild className="py-16">
        <section id="plekken" aria-labelledby="plekken-title">
          <h2 id="plekken-title" className={typography.section}>
            Op het domein
          </h2>
          <p className={typography.kicker}>
            Twaalf plekken, van de paarden in de wei tot de bijen achter de boomgaard.
          </p>
          <ol className="m-0 mt-10 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place, index) => (
              <li key={place.id} id={`plek-${place.id}`} className="scroll-mt-20">
                <Card className="h-full gap-0 py-0">
                  <div className="relative aspect-4/3 bg-powder" style={closeUp(place)}>
                    {place.label && (
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-obsidian/60 to-transparent px-4 pt-10 pb-3">
                        <img
                          src={place.label}
                          alt=""
                          aria-hidden="true"
                          className="h-10 w-auto max-w-full object-contain object-left"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 grid size-7 place-items-center rounded-full bg-pure-surface font-sans text-label font-medium shadow-subtle-4">
                      {index + 1}
                    </span>
                  </div>
                  <CardContent className="grid flex-1 content-start gap-3 py-5">
                    <h3 className={typography.heading}>{place.title}</h3>
                    <p className={cn(typography.small, "m-0 text-cinder")}>{place.text}</p>
                    <Link
                      to={place.href}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "mt-auto w-fit",
                      )}
                    >
                      {place.linkLabel} <ArrowRight />
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </div>
  );
}
