// PROTOTYPE (site/prototype/homepage-map): homepage map variants. Throwaway; see README.md here.
//
// The places on the map, derived from the existing map sentinels (config.ts) plus what the
// prototypes need: a title, the page each place links to, and its hand-lettered label.
// Link targets are a first guess; check them before folding a variant in.
import { interactiveMapRegistry } from "@/config/registries";

export const MAP_WIDTH = interactiveMapRegistry.dimensions.width;
export const MAP_HEIGHT = interactiveMapRegistry.dimensions.height;
export const MAP_ASPECT = MAP_WIDTH / MAP_HEIGHT;
export const MAP_SRC_SET = interactiveMapRegistry.assets.webpSrcSet.join(", ");
export const MAP_PLACEHOLDER = interactiveMapRegistry.assets.placeholderSrc;
export const MAP_DETAIL_SRC = "/wilhalla_map-2560.webp";

export type Place = {
  id: string;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  /** Hand-lettered name (public/map-overlays/card-labels). */
  label?: string;
  /** Painted highlight over the map (same size as the map), if there is one. */
  overlay?: string;
  /** Bounding box on the 4000x2337 map. */
  box: { x1: number; y1: number; x2: number; y2: number };
};

const extra: Record<string, Pick<Place, "title" | "href" | "linkLabel" | "label">> = {
  horses: {
    title: "De paarden",
    href: "/welzijn/paardencoaching",
    linkLabel: "Paardencoaching",
    label: "horses",
  },
  barn: { title: "De schuur", href: "/verhuur", linkLabel: "Verhuur", label: "barn" },
  "vake-tree": {
    title: "Vake's boom",
    href: "/over-ons",
    linkLabel: "Over ons",
    label: "vake-tree",
  },
  garden: {
    title: "De samentuin",
    href: "/over-ons/samentuin",
    linkLabel: "Samentuin",
    label: "garden",
  },
  yurt: { title: "De yurt", href: "/yoga", linkLabel: "Yoga in de yurt", label: "yurt" },
  "caption-boomgaard-kleinfruit": {
    title: "Boomgaard & kleinfruit",
    href: "/over-ons/samentuin",
    linkLabel: "Samentuin",
    label: "boomgaard-kleinfruit",
  },
  "caption-kippenhok": {
    title: "Kippenhok",
    href: "/over-ons/samentuin",
    linkLabel: "Samentuin",
    label: "kippenhok",
  },
  "caption-bijen": {
    title: "De bijen",
    href: "/over-ons/samentuin",
    linkLabel: "Samentuin",
    label: "bijen",
  },
  "caption-trampoline": {
    title: "Trampoline",
    href: "/verhuur",
    linkLabel: "Verhuur",
    label: "trampoline",
  },
  "caption-parking": { title: "Parking", href: "/contact", linkLabel: "Route", label: "parking" },
  "caption-windroos": {
    title: "Ligging",
    href: "/contact",
    linkLabel: "Contact & route",
    label: "zoerselbos",
  },
  swallows: {
    title: "De zwaluwen",
    href: "/over-ons",
    linkLabel: "Over ons",
    label: "trek-mee-naar-kameroen",
  },
};

const fallbackText: Record<string, string> = {
  swallows: "Elk voorjaar keren de zwaluwen terug van hun trek naar Kameroen.",
};

// Main places first, small captions after: the order of lists, tours and pins.
const order = [
  "horses",
  "vake-tree",
  "barn",
  "garden",
  "yurt",
  "caption-boomgaard-kleinfruit",
  "caption-kippenhok",
  "caption-bijen",
  "caption-trampoline",
  "swallows",
  "caption-parking",
  "caption-windroos",
];

export const places: Place[] = order.flatMap((id) => {
  const sentinel = interactiveMapRegistry.sentinels.find((s) => s.id === id);
  const meta = extra[id];
  if (!sentinel || !meta) return [];
  const explanation = "explanation" in sentinel ? sentinel.explanation : undefined;
  return [
    {
      id,
      ...meta,
      label: meta.label ? `/map-overlays/card-labels/${meta.label}.webp` : undefined,
      text: explanation?.text ?? fallbackText[id] ?? "",
      overlay: sentinel.hoverImages.find((image) => image.includes("/hover/")),
      box: {
        x1: Math.min(sentinel.x1, sentinel.x2),
        y1: Math.min(sentinel.y1, sentinel.y2),
        x2: Math.max(sentinel.x1, sentinel.x2),
        y2: Math.max(sentinel.y1, sentinel.y2),
      },
    },
  ];
});

export const mainPlaces = places.slice(0, 5);

export function placeCenter(place: Place) {
  return { x: (place.box.x1 + place.box.x2) / 2, y: (place.box.y1 + place.box.y2) / 2 };
}

/** Position of a place as a percentage of the map, for absolutely placed markers. */
export function placePercent(place: Place) {
  const { x, y } = placeCenter(place);
  return { left: `${(x / MAP_WIDTH) * 100}%`, top: `${(y / MAP_HEIGHT) * 100}%` };
}
