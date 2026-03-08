import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { MapHotspot } from "./hotspots";

type MapHotspotProps = {
  hotspot: MapHotspot;
};

export function MapHotspotPath({ hotspot }: MapHotspotProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <g>
      <path
        d={hotspot.path}
        fill={hovered ? "rgba(255,255,255,0.12)" : "transparent"}
        stroke={hovered ? "rgba(0,0,0,0.6)" : "none"}
        strokeWidth={hovered ? 2 : 0}
        filter="url(#pencil-stroke)"
        className="cursor-pointer transition-all duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate({ to: hotspot.route })}
        role="button"
        tabIndex={0}
        aria-label={hotspot.label}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate({ to: hotspot.route });
          }
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      />

      {/* Label */}
      <text
        x={hotspot.labelPosition.x}
        y={hotspot.labelPosition.y}
        textAnchor="middle"
        className="pointer-events-none select-none transition-opacity duration-300"
        style={{
          fontFamily: "'EB Garamond Variable', serif",
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          fill: hovered ? "#1a1a1a" : "transparent",
          opacity: hovered ? 1 : 0,
        }}
      >
        {hotspot.label}
      </text>
    </g>
  );
}
