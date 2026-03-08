const MAP_WIDTH = 4000;
const MAP_HEIGHT = 2337;

export interface MapSentinelProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onHoverChange?: (id: string | null) => void;
  padding?: number;
  debug?: boolean;
}

// Rendered inside <svg viewBox="0 0 4000 2337"> — coordinates are image pixels.
export function MapSentinel({
  id,
  x1,
  y1,
  x2,
  y2,
  onHoverChange,
  padding = 40,
  debug = false,
}: MapSentinelProps) {
  const minX = Math.max(0, Math.min(x1, x2) - padding);
  const minY = Math.max(0, Math.min(y1, y2) - padding);
  const maxX = Math.min(MAP_WIDTH, Math.max(x1, x2) + padding);
  const maxY = Math.min(MAP_HEIGHT, Math.max(y1, y2) + padding);
  const w = maxX - minX;
  const h = maxY - minY;

  const setActive = (nextHovered: boolean) => {
    onHoverChange?.(nextHovered ? id : null);
  };

  return (
    <g>
      {/* Hit area — transparent, just catches mouse events */}
      <rect
        x={minX}
        y={minY}
        width={w}
        height={h}
        fill={debug ? "rgba(255,0,0,0.12)" : "transparent"}
        stroke={debug ? "red" : "none"}
        strokeWidth={debug ? 4 : 0}
        className="cursor-pointer"
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
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
