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
