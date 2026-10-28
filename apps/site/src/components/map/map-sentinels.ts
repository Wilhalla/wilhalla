import { interactiveMapRegistry } from "@/config/registries";
import type { MapSentinelConfig, MapSentinelExplanation } from "@/types";

export type { MapSentinelConfig, MapSentinelExplanation };

export const mapSentinels = interactiveMapRegistry.sentinels;

export type SentinelBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function getSentinelBounds(sentinel: MapSentinelConfig): SentinelBounds {
  const padding =
    sentinel.padding ?? interactiveMapRegistry.defaultSentinelPadding;

  return {
    minX: Math.min(sentinel.x1, sentinel.x2) - padding,
    minY: Math.min(sentinel.y1, sentinel.y2) - padding,
    maxX: Math.max(sentinel.x1, sentinel.x2) + padding,
    maxY: Math.max(sentinel.y1, sentinel.y2) + padding,
  };
}

function getSentinelArea(sentinel: MapSentinelConfig): number {
  const bounds = getSentinelBounds(sentinel);
  return (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
}

function containsPoint(
  sentinel: MapSentinelConfig,
  point: { x: number; y: number },
): boolean {
  const bounds = getSentinelBounds(sentinel);

  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
}

function containsSentinel(
  outer: MapSentinelConfig,
  inner: MapSentinelConfig,
): boolean {
  if (outer.id === inner.id) return false;

  const outerBounds = getSentinelBounds(outer);
  const innerBounds = getSentinelBounds(inner);

  return (
    outerBounds.minX <= innerBounds.minX &&
    outerBounds.minY <= innerBounds.minY &&
    outerBounds.maxX >= innerBounds.maxX &&
    outerBounds.maxY >= innerBounds.maxY
  );
}

function getSentinelDepth(sentinel: MapSentinelConfig): number {
  return mapSentinels.filter((candidate) =>
    containsSentinel(candidate, sentinel),
  ).length;
}

function compareSpecificity(
  left: MapSentinelConfig,
  right: MapSentinelConfig,
): number {
  const depthDifference = getSentinelDepth(right) - getSentinelDepth(left);
  if (depthDifference !== 0) return depthDifference;

  const areaDifference = getSentinelArea(left) - getSentinelArea(right);
  if (areaDifference !== 0) return areaDifference;

  return (
    mapSentinels.findIndex((sentinel) => sentinel.id === left.id) -
    mapSentinels.findIndex((sentinel) => sentinel.id === right.id)
  );
}

export function getActiveSentinelId(point: {
  x: number;
  y: number;
}): string | null {
  // Pick the most specific matching zone: nested regions win, then smaller hit areas.
  const matchingSentinel = mapSentinels
    .filter((sentinel) => containsPoint(sentinel, point))
    .sort(compareSpecificity)[0];

  return matchingSentinel?.id ?? null;
}

export function getSentinelHoverImages(id: string): string[] {
  const activeSentinel = mapSentinels.find((sentinel) => sentinel.id === id);
  if (!activeSentinel) return [];

  const ancestorImages = mapSentinels
    .filter((sentinel) => containsSentinel(sentinel, activeSentinel))
    .sort((left, right) => getSentinelArea(right) - getSentinelArea(left))
    .flatMap((sentinel) => sentinel.hoverImages);

  return [...new Set([...ancestorImages, ...activeSentinel.hoverImages])];
}

export function getSentinelTextImages(id: string): string[] {
  return [
    ...(mapSentinels.find((sentinel) => sentinel.id === id)?.hoverImages ?? []),
  ].filter((image) => image.includes("/map-overlays/text/"));
}

export function getSentinelExplanation(
  id: string,
): MapSentinelExplanation | null {
  return (
    mapSentinels.find((sentinel) => sentinel.id === id)?.explanation ?? null
  );
}

export function getSentinelFallbackGlowBounds(
  id: string,
): SentinelBounds | null {
  const activeSentinel = mapSentinels.find((sentinel) => sentinel.id === id);
  if (!activeSentinel) return null;

  const hasPaintedHoverOverlay = activeSentinel.hoverImages.some((image) =>
    image.includes("/hover/"),
  );
  if (hasPaintedHoverOverlay) return null;

  return getSentinelBounds(activeSentinel);
}
