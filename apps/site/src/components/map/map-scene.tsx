import { siteConfig } from "@/config";
import type { MapPoint } from "@/types";
import { cn } from "@wilhalla/ui/lib/utils";
import type { PointerEvent, ReactNode } from "react";
import { MapHotspot } from "./map-hotspot";
import { PencilFilter } from "./pencil-filter";

const map = siteConfig.map;

interface MapSceneProps {
  /** Layers between the drawing and the pointer surface (overlay images). */
  overlays: ReactNode;
  /** Drawn in map pixels inside the SVG (glow, explanation card). */
  children: ReactNode;
  /** Shows that a click leads somewhere. */
  clickable: boolean;
  onPointAt: (point: MapPoint | null) => void;
  onPress: (point: MapPoint) => void;
}

function mapPointOf(event: PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) {
  const matrix = event.currentTarget.getScreenCTM();

  return matrix
    ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    : null;
}

/**
 * The drawing with its pointer surface: reports where on the map (in map pixels) the visitor
 * points and presses. The surface is hidden from assistive technology; the place list is its
 * keyboard and screen reader equivalent.
 */
export function MapScene({ overlays, children, clickable, onPointAt, onPress }: MapSceneProps) {
  return (
    <>
      <img
        src={map.assets.placeholderSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        decoding="async"
      />
      <picture>
        <source
          media={map.desktopMediaQuery}
          type="image/webp"
          srcSet={map.assets.desktopWebpSrc}
        />
        <source
          type="image/webp"
          srcSet={map.assets.webpSrcSet.join(", ")}
          sizes={map.sceneSizes}
        />
        <img
          src={map.assets.fallbackSrc}
          srcSet={map.assets.fallbackSrcSet}
          sizes={map.desktopImgSizes}
          alt={map.imageAlt}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {overlays}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${map.dimensions.width} ${map.dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
        className={cn("absolute inset-0 size-full", clickable && "cursor-pointer")}
        onPointerMove={(event) => onPointAt(mapPointOf(event))}
        onPointerLeave={() => onPointAt(null)}
        onClick={(event) => {
          const point = mapPointOf(event);

          // A hotspot link handles its own click.
          if (point && !event.defaultPrevented) {
            onPress(point);
          }
        }}
      >
        <PencilFilter />
        {map.hotspots.map((hotspot) => (
          <MapHotspot key={hotspot.id} hotspot={hotspot} />
        ))}
        {children}
      </svg>
    </>
  );
}
