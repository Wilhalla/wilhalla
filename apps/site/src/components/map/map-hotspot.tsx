import type { MapHotspotConfig } from "@/types";
import { Link } from "@tanstack/react-router";

/**
 * An outlined building that links to its page. The map SVG is hidden from assistive technology;
 * keyboard users reach the same destinations through the place list.
 */
export function MapHotspot({ hotspot }: { hotspot: MapHotspotConfig }) {
  return (
    <Link to={hotspot.route} aria-label={hotspot.label} tabIndex={-1} className="group">
      <path
        d={hotspot.path}
        filter="url(#pencil-stroke)"
        className="cursor-pointer fill-transparent stroke-transparent stroke-2 transition-[fill,stroke] duration-hover ease-out group-hover:fill-white/12 group-hover:stroke-black/60"
      />
      <text
        x={hotspot.labelPosition.x}
        y={hotspot.labelPosition.y}
        textAnchor="middle"
        className="pointer-events-none fill-obsidian font-heading text-base font-medium tracking-caps uppercase opacity-0 transition-opacity duration-hover ease-out select-none group-hover:opacity-100"
      >
        {hotspot.label}
      </text>
    </Link>
  );
}
