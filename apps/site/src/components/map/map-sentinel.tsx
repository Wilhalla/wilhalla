import { interactiveMapRegistry } from "@/config/registries";

export interface MapSentinelProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  padding?: number;
  debug?: boolean;
}

// Rendered inside the map SVG viewBox — coordinates are image pixels.
export function MapSentinel({
  x1,
  y1,
  x2,
  y2,
  padding = interactiveMapRegistry.defaultSentinelPadding,
  debug = false,
}: MapSentinelProps) {
  if (!debug) return null;

  const { height: mapHeight, width: mapWidth } =
    interactiveMapRegistry.dimensions;
  const minX = Math.max(0, Math.min(x1, x2) - padding);
  const minY = Math.max(0, Math.min(y1, y2) - padding);
  const maxX = Math.min(mapWidth, Math.max(x1, x2) + padding);
  const maxY = Math.min(mapHeight, Math.max(y1, y2) + padding);
  const w = maxX - minX;
  const h = maxY - minY;

  return (
    <g>
      <rect
        x={minX}
        y={minY}
        width={w}
        height={h}
        fill={debug ? "rgba(255,0,0,0.12)" : "transparent"}
        stroke={debug ? "red" : "none"}
        strokeWidth={debug ? 4 : 0}
        pointerEvents="none"
      />

      {/* Debug label */}
      {debug && (
        <text
          x={minX + 4}
          y={minY + 16}
          fill="black"
          fontSize={14}
          fontFamily="monospace"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {minX},{minY} → {maxX},{maxY}
        </text>
      )}
    </g>
  );
}
