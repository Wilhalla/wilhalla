// PROTOTYPE (site/prototype/homepage-map): small pieces the variants share.
import { useEffect, useState } from "react";

import { MAP_PLACEHOLDER, MAP_SRC_SET, type Place } from "./places";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** The painted map, filling its (aspect-ratio sized) parent. */
export function MapPicture({ sizes, eager = true }: { sizes: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <img
        src={MAP_PLACEHOLDER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <img
        src="/wilhalla_map-1920.webp"
        srcSet={MAP_SRC_SET}
        sizes={sizes}
        alt="Getekende kaart van het domein Wilhalla"
        className="absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out data-[loaded=false]:opacity-0"
        data-loaded={loaded}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setLoaded(true);
        }}
      />
    </>
  );
}

/** Painted highlights of the given places, cross-fading in over the map. */
export function PlaceOverlays({ places, active }: { places: Place[]; active: string | null }) {
  return (
    <>
      {places
        .filter((place) => place.overlay)
        .map((place) => (
          <img
            key={place.id}
            src={place.overlay}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-out data-[active=true]:opacity-100 motion-reduce:transition-none"
            data-active={place.id === active}
            loading="lazy"
            decoding="async"
          />
        ))}
    </>
  );
}
