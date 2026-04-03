export type MapSentinelConfig = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hoverImages: string[];
  includeInIntro?: boolean;
  padding?: number;
};

type SentinelBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function getSentinelBounds(sentinel: MapSentinelConfig): SentinelBounds {
  const padding = sentinel.padding ?? 0;

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
  return mapSentinels.filter((candidate) => containsSentinel(candidate, sentinel))
    .length;
}

function compareSpecificity(
  left: MapSentinelConfig,
  right: MapSentinelConfig,
): number {
  const depthDifference = getSentinelDepth(right) - getSentinelDepth(left);
  if (depthDifference !== 0) return depthDifference;

  const areaDifference = getSentinelArea(left) - getSentinelArea(right);
  if (areaDifference !== 0) return areaDifference;

  return mapSentinels.findIndex((sentinel) => sentinel.id === left.id) -
    mapSentinels.findIndex((sentinel) => sentinel.id === right.id);
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

// These regions are defined in full-map pixel coordinates (4000x2337).
export const mapSentinels: MapSentinelConfig[] = [
  {
    id: "horses",
    x1: 400,
    y1: 1350,
    x2: 990,
    y2: 1900,
    hoverImages: ["/map-overlays/hover/horses.webp"],
    padding: 40,
  },
  {
    id: "barn",
    x1: 2050,
    y1: 1550,
    x2: 2250,
    y2: 1685,
    hoverImages: ["/map-overlays/hover/barn.webp"],
    padding: 40,
  },
  {
    id: "vake-tree",
    x1: 1900,
    y1: 1550,
    x2: 2000,
    y2: 1675,
    hoverImages: ["/map-overlays/hover/vake-tree.webp"],
    padding: 40,
  },
  {
    id: "garden",
    x1: 2460,
    y1: 1085,
    x2: 2935,
    y2: 1440,
    hoverImages: ["/map-overlays/hover/garden.webp"],
    padding: 40,
  },
  {
    id: "yurt",
    x1: 2850,
    y1: 1517,
    x2: 3085,
    y2: 1740,
    hoverImages: ["/map-overlays/hover/yurt.webp"],
    padding: 40,
  },
  {
    id: "swallows",
    x1: 1855,
    y1: 830,
    x2: 2745,
    y2: 1030,
    hoverImages: ["/map-overlays/hover/swallows.webp"],
    padding: 40,
  },
  {
    id: "caption-kippenhok",
    x1: 2330,
    y1: 1239,
    x2: 2490,
    y2: 1404,
    hoverImages: ["/map-overlays/text/kippenhok.webp"],
    includeInIntro: false,
  },
  {
    id: "caption-trampoline",
    x1: 2205,
    y1: 1258,
    x2: 2301,
    y2: 1330,
    hoverImages: ["/map-overlays/text/trampoline.webp"],
    includeInIntro: false,
  },
  {
    id: "caption-parking",
    x1: 1750,
    y1: 1517,
    x2: 1942,
    y2: 1639,
    hoverImages: ["/map-overlays/text/parking.webp"],
    includeInIntro: false,
  },
  {
    id: "caption-boomgaard-kleinfruit",
    x1: 2833,
    y1: 1089,
    x2: 3595,
    y2: 1785,
    hoverImages: ["/map-overlays/text/boomgaard-kleinfruit.webp"],
    includeInIntro: false,
  },
  {
    id: "caption-windroos",
    x1: 691,
    y1: 793,
    x2: 1003,
    y2: 1057,
    hoverImages: [
      "/map-overlays/text/zoerselbos.webp",
      "/map-overlays/text/halle-dorp.webp",
    ],
    includeInIntro: false,
  },
  {
    id: "caption-bijen",
    x1: 3411,
    y1: 1413,
    x2: 3575,
    y2: 1589,
    hoverImages: ["/map-overlays/text/bijen.webp"],
    includeInIntro: false,
  },
];
