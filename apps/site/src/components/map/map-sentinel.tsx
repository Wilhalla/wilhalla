const MAP_WIDTH = 4000;
const MAP_HEIGHT = 2337;

export interface MapSentinelProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  padding?: number;
  debug?: boolean;
}

// Rendered inside <svg viewBox="0 0 4000 2337"> — coordinates are image pixels.
export function MapSentinel({
  x1,
  y1,
  x2,
  y2,
  padding = 40,
  debug = false,
}: MapSentinelProps) {
  if (!debug) return null;

  const minX = Math.max(0, Math.min(x1, x2) - padding);
  const minY = Math.max(0, Math.min(y1, y2) - padding);
  const maxX = Math.min(MAP_WIDTH, Math.max(x1, x2) + padding);
  const maxY = Math.min(MAP_HEIGHT, Math.max(y1, y2) + padding);
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
