import { interactiveMapRegistry } from "@/config/registries";
import {
  getSentinelExplanation,
  getSentinelHoverImages,
  getSentinelTextImages,
  type MapSentinelExplanation,
  mapSentinels,
} from "@/components/map/map-sentinels";

export type ViewBoxRect = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const TEXT_OVERLAY_PATH_SEGMENT = "/map-overlays/text/";
const CARD_LABEL_PATH_SEGMENT = "/map-overlays/card-labels/";
const DARK_INK_CARD_LABELS = new Set([
  "horses.webp",
  "trek-mee-naar-kameroen.webp",
]);
export const CARD_VIEWPORT_MARGIN = 64;

export const allMapHoverImages = Array.from(
  new Set(mapSentinels.flatMap((sentinel) => sentinel.hoverImages)),
);

export const introMapSequence = [...mapSentinels]
  .filter((sentinel) => sentinel.includeInIntro !== false)
  .sort((left, right) => {
    const leftOrder = left.x1 + left.y1;
    const rightOrder = right.x1 + right.y1;

    return leftOrder - rightOrder;
  });

export const mapDiscoveryTimings = interactiveMapRegistry.timings;

export function isTextOverlayImage(image: string) {
  return image.includes(TEXT_OVERLAY_PATH_SEGMENT);
}

export function getCardLabelImageSrc(image: string) {
  return image.replace(TEXT_OVERLAY_PATH_SEGMENT, CARD_LABEL_PATH_SEGMENT);
}

export function hasDarkInkCardLabel(image: string) {
  return DARK_INK_CARD_LABELS.has(image.split("/").at(-1) ?? "");
}

export function getActiveMapDiscovery({
  hoveredSentinelId,
  introActiveSentinelId,
}: {
  hoveredSentinelId: string | null;
  introActiveSentinelId: string | null;
}) {
  return {
    activeHoverImages: hoveredSentinelId
      ? getSentinelHoverImages(hoveredSentinelId)
      : introActiveSentinelId
        ? getSentinelHoverImages(introActiveSentinelId)
        : [],
    activeExplanation: hoveredSentinelId
      ? getSentinelExplanation(hoveredSentinelId)
      : null,
    activeLabelImages: hoveredSentinelId
      ? getSentinelTextImages(hoveredSentinelId).map(getCardLabelImageSrc)
      : [],
  };
}

export function getMapOverlayTransitionDurationMs({
  introDismissed,
  introOverlayTransitionMs,
  onboardingVisible,
}: {
  introDismissed: boolean;
  introOverlayTransitionMs: number;
  onboardingVisible: boolean;
}) {
  return onboardingVisible && !introDismissed
    ? introOverlayTransitionMs
    : mapDiscoveryTimings.desktopOverlayTransitionMs;
}

export function clampCardPosition({
  fallback,
  margin,
  size,
  viewportMax,
  viewportMin,
}: {
  fallback: number;
  margin: number;
  size: number;
  viewportMax: number;
  viewportMin: number;
}) {
  const min = viewportMin + margin;
  const max = viewportMax - size - margin;

  if (max < min) return viewportMin + (viewportMax - viewportMin - size) / 2;

  return Math.min(Math.max(fallback, min), max);
}

export function getAdjustedExplanationPosition({
  explanation,
  visibleViewBoxRect,
}: {
  explanation: MapSentinelExplanation;
  visibleViewBoxRect: ViewBoxRect | null;
}) {
  const { defaultHeight, defaultWidth } =
    interactiveMapRegistry.explanationCard;
  const height = explanation.height ?? defaultHeight;
  const width = explanation.width ?? defaultWidth;

  if (!visibleViewBoxRect) {
    return { x: explanation.x, y: explanation.y, width, height };
  }

  return {
    x: clampCardPosition({
      fallback: explanation.x,
      margin: CARD_VIEWPORT_MARGIN,
      size: width,
      viewportMax: visibleViewBoxRect.maxX,
      viewportMin: visibleViewBoxRect.minX,
    }),
    y: clampCardPosition({
      fallback: explanation.y,
      margin: CARD_VIEWPORT_MARGIN,
      size: height,
      viewportMax: visibleViewBoxRect.maxY,
      viewportMin: visibleViewBoxRect.minY,
    }),
    width,
    height,
  };
}
