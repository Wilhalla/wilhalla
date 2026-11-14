import type { MapRect } from "./map-sentinels";

/** A warm glow over a place that has no painted hover overlay of its own. */
export function FallbackSentinelGlow({ rect }: { rect: MapRect }) {
  const width = rect.maxX - rect.minX;
  const height = rect.maxY - rect.minY;

  return (
    <g pointerEvents="none">
      <defs>
        <filter id="map-fallback-sentinel-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <ellipse
        cx={rect.minX + width / 2}
        cy={rect.minY + height / 2}
        rx={Math.max(90, width * 0.62)}
        ry={Math.max(70, height * 0.58)}
        opacity={0.34}
        filter="url(#map-fallback-sentinel-glow)"
        className="fill-map-glow mix-blend-screen"
      />
    </g>
  );
}
