import { siteConfig } from "@/config";
import { useViewportSize } from "@/hooks/use-viewport-size";
import { cn } from "@wilhalla/ui/lib/utils";
import {
  type SentinelId,
  cardLabelSources,
  clampCardPosition,
  getSentinel,
  visibleMapRect,
} from "./map-sentinels";

const { desktopZoom, explanationCardHeight } = siteConfig.map;

interface SentinelExplanationCardProps {
  id: SentinelId;
  visible: boolean;
}

/**
 * A sentence about a place, drawn in the map's own coordinates on wide screens. Mount it with
 * `key={id}`: a new place fades its card in, `visible` fades the current one out.
 */
export function SentinelExplanationCard({ id, visible }: SentinelExplanationCardProps) {
  const viewport = useViewportSize();
  const { explanation, link } = getSentinel(id);
  const labels = cardLabelSources(id);
  const onScreen = viewport && visibleMapRect(viewport, desktopZoom);

  return (
    explanation && (
      <foreignObject
        x={
          onScreen
            ? clampCardPosition(explanation.x, explanation.width, [onScreen.minX, onScreen.maxX])
            : explanation.x
        }
        y={
          onScreen
            ? clampCardPosition(explanation.y, explanationCardHeight, [
                onScreen.minY,
                onScreen.maxY,
              ])
            : explanation.y
        }
        width={explanation.width}
        height={explanationCardHeight}
        className="pointer-events-none overflow-visible max-lg:hidden"
      >
        <div
          className={cn(
            "flex min-h-full flex-col items-start justify-center gap-6 rounded-map-card border px-9 py-7 shadow-map-float backdrop-blur-xs transition-[opacity,translate,scale] duration-enter ease-enter starting:translate-y-2.5 starting:scale-98 starting:opacity-0",
            !visible && "translate-y-2.5 scale-98 opacity-0 duration-exit ease-exit",
            // The card takes the tone that contrasts with the ink of its hand-lettered label.
            explanation.labelInk === "dark"
              ? "border-map-ink/10 bg-map-paper/90 text-map-ink"
              : "border-map-cream/15 bg-map-night/88 text-map-cream",
          )}
        >
          <div className="flex max-w-full flex-wrap items-end gap-3.5">
            {labels.map((label) => (
              <img
                key={label}
                src={label}
                alt=""
                className={cn(
                  "block h-auto max-w-full object-contain drop-shadow-map-label",
                  id === "vake-tree" ? "max-h-41 min-h-23" : "max-h-33 min-h-16",
                )}
                decoding="async"
              />
            ))}
          </div>
          <p className="m-0 font-heading text-map-card leading-map-card tracking-ui">
            {explanation.text}
          </p>
          {link && (
            <p className="m-0 mt-4.5 font-heading text-map-card-link leading-map-card-link tracking-ui underline decoration-1 underline-offset-8 opacity-75">
              {link.label} →
            </p>
          )}
        </div>
      </foreignObject>
    )
  );
}
