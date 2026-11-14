import { siteConfig } from "@/config";
import type { MapPoint, MapSentinelConfig } from "@/types";

const { sentinels, sentinelPadding, mobileStops, dimensions } = siteConfig.map;

export type SentinelId = (typeof sentinels)[number]["id"];
export type MapSentinel = MapSentinelConfig & { id: SentinelId };

export interface MapRect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** A full-map image layered over the drawing; captions are the hand-lettered place names. */
export interface MapOverlayImage {
  src: string;
  caption: boolean;
}

export const mapSentinels: readonly MapSentinel[] = sentinels;

export function getSentinel(id: SentinelId) {
  const sentinel = mapSentinels.find((candidate) => candidate.id === id);

  if (!sentinel) {
    throw new Error(`Unknown map sentinel: ${id}`);
  }

  return sentinel;
}

// --- Geometry ----------------------------------------------------------------------------------

function boundsOf(sentinel: MapSentinel): MapRect {
  return {
    minX: Math.min(sentinel.x1, sentinel.x2) - sentinelPadding,
    minY: Math.min(sentinel.y1, sentinel.y2) - sentinelPadding,
    maxX: Math.max(sentinel.x1, sentinel.x2) + sentinelPadding,
    maxY: Math.max(sentinel.y1, sentinel.y2) + sentinelPadding,
  };
}

function areaOf(sentinel: MapSentinel) {
  const bounds = boundsOf(sentinel);

  return (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
}

function isPointInPolygon(point: MapPoint, polygon: readonly MapPoint[]) {
  return polygon.reduce((inside, current, index) => {
    const previous = polygon.at(index - 1) ?? current;
    const crossesRay =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;

    return crossesRay ? !inside : inside;
  }, false);
}

function containsPoint(sentinel: MapSentinel, point: MapPoint) {
  if (sentinel.activationPolygon) {
    return isPointInPolygon(point, sentinel.activationPolygon);
  }

  const bounds = boundsOf(sentinel);

  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
}

function containsSentinel(outer: MapSentinel, inner: MapSentinel) {
  if (outer.id === inner.id) {
    return false;
  }

  const bounds = boundsOf(inner);

  return [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.maxY },
    { x: bounds.minX, y: bounds.maxY },
  ].every((corner) => containsPoint(outer, corner));
}

function ancestorsOf(sentinel: MapSentinel) {
  return mapSentinels.filter((candidate) => containsSentinel(candidate, sentinel));
}

/** Most specific first: nested places win over the place around them, then smaller hit areas. */
const sentinelsBySpecificity = mapSentinels.toSorted(
  (left, right) =>
    ancestorsOf(right).length - ancestorsOf(left).length || areaOf(left) - areaOf(right),
);

export function sentinelAt(point: MapPoint): SentinelId | null {
  return sentinelsBySpecificity.find((sentinel) => containsPoint(sentinel, point))?.id ?? null;
}

/**
 * The part of the map that is on screen, in map pixels. The map is cropped to cover the screen
 * and then enlarged by `zoom` from the middle of its top edge.
 */
export function visibleMapRect(viewport: { width: number; height: number }, zoom: number): MapRect {
  const scale = Math.max(viewport.width / dimensions.width, viewport.height / dimensions.height);
  const width = viewport.width / scale / zoom;
  const minX = (dimensions.width - width) / 2;
  const minY = (dimensions.height - viewport.height / scale) / 2;

  return { minX, minY, maxX: minX + width, maxY: minY + viewport.height / scale / zoom };
}

/** Keeps a card of `size` at `preferred` unless that leaves it closer than `margin` to an edge. */
export function clampCardPosition(
  preferred: number,
  size: number,
  [visibleMin, visibleMax]: [number, number],
  margin = 64,
) {
  const min = visibleMin + margin;
  const max = visibleMax - size - margin;

  return max < min
    ? visibleMin + (visibleMax - visibleMin - size) / 2
    : Math.min(Math.max(preferred, min), max);
}

// --- Images ------------------------------------------------------------------------------------

const overlaySrc = (name: string) => `/map-overlays/hover/${name}.webp`;
const captionSrc = (name: string) => `/map-overlays/text/${name}.webp`;

function ownImages({ overlay, captions }: MapSentinel): MapOverlayImage[] {
  return [
    ...(overlay ? [{ src: overlaySrc(overlay), caption: false }] : []),
    ...captions.map((name) => ({ src: captionSrc(name), caption: true })),
  ];
}

export const mapOverlayImages = mapSentinels
  .flatMap(ownImages)
  .filter((image, index, all) => all.findIndex((other) => other.src === image.src) === index);

/** The images that light up for a place: its own and those of the places around it. */
export function overlayImageSources(id: SentinelId) {
  const sentinel = getSentinel(id);

  return [...ancestorsOf(sentinel), sentinel].flatMap(ownImages).map((image) => image.src);
}

/** The hand-lettered names of a place, cut out for use on its explanation card. */
export function cardLabelSources(id: SentinelId) {
  return getSentinel(id).captions.map((name) => `/map-overlays/card-labels/${name}.webp`);
}

/** A place without a painted overlay gets a soft glow over its area instead. */
export function fallbackGlowRect(id: SentinelId) {
  const sentinel = getSentinel(id);

  return sentinel.overlay ? null : boundsOf(sentinel);
}

// --- Tours -------------------------------------------------------------------------------------

/** The places the intro lights up one after another, from the top-left of the map onwards. */
export const introSequence = mapSentinels
  .filter((sentinel) => sentinel.includeInIntro !== false)
  .toSorted((left, right) => left.x1 + left.y1 - (right.x1 + right.y1));

/** At which step of the intro an overlay image lights up; absent for images outside the intro. */
export const introStepByImage = new Map(
  introSequence
    .flatMap((sentinel, step) =>
      overlayImageSources(sentinel.id).map((src): [string, number] => [src, step]),
    )
    .toReversed(),
);

export const mapStops = mobileStops.map((id) => {
  const { stop } = getSentinel(id);

  if (!stop) {
    throw new Error(`Map stop without label and focus: ${id}`);
  }

  return { id, ...stop };
});

function destinationOf(link: NonNullable<MapSentinel["link"]>) {
  return "to" in link ? link.to : link.href;
}

/** Every place that leads somewhere, once per destination: the keyboard and screen reader route. */
export const linkedSentinels = mapSentinels.flatMap((sentinel, index) => {
  const { link } = sentinel;
  const isFirst =
    link &&
    mapSentinels.findIndex(
      (other) => other.link && destinationOf(other.link) === destinationOf(link),
    ) === index;

  return link && isFirst ? [{ id: sentinel.id, link }] : [];
});
