export type MapSentinelConfig = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hoverImage: string;
};

// These regions are defined in full-map pixel coordinates (4000x2337).
export const mapSentinels: MapSentinelConfig[] = [
  {
    id: "horses",
    x1: 400,
    y1: 1350,
    x2: 990,
    y2: 1900,
    hoverImage: "/map-overlays/hover/horses.webp",
  },
  {
    id: "barn",
    x1: 2050,
    y1: 1550,
    x2: 2250,
    y2: 1685,
    hoverImage: "/map-overlays/hover/barn.webp",
  },
  {
    id: "vake-tree",
    x1: 1900,
    y1: 1550,
    x2: 2000,
    y2: 1675,
    hoverImage: "/map-overlays/hover/vake-tree.webp",
  },
  {
    id: "garden",
    x1: 2460,
    y1: 1085,
    x2: 2935,
    y2: 1440,
    hoverImage: "/map-overlays/hover/garden.webp",
  },
  {
    id: "yurt",
    x1: 2850,
    y1: 1517,
    x2: 3085,
    y2: 1740,
    hoverImage: "/map-overlays/hover/yurt.webp",
  },
  {
    id: "swallows",
    x1: 1855,
    y1: 830,
    x2: 2745,
    y2: 1030,
    hoverImage: "/map-overlays/hover/swallows.webp",
  },
];
