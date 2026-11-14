import type { LinkProps } from "@tanstack/react-router";

export type SocialLink = {
  label: string;
  /** What the account is, shown under the label on the contact page. */
  detail: string;
  href: string;
  icon: "facebook" | "instagram";
};

/** Where a place on the map leads: a route of this site or another website. */
export type MapLink = { label: string } & (
  | { to: LinkProps["to"] }
  | { href: string; newTab?: boolean }
);

export interface MapHotspotConfig {
  id: string;
  label: string;
  route: LinkProps["to"];
  path: string;
  labelPosition: MapPoint;
}

/** Card with a sentence about a place, positioned in map pixels; shown on wide screens. */
export interface MapSentinelExplanation {
  text: string;
  x: number;
  y: number;
  width: number;
  /** Ink of the hand-lettered caption shown on the card; the card takes the contrasting tone. */
  labelInk?: "dark";
}

export interface MapPoint {
  x: number;
  y: number;
}

/** Where the small-screen map pans and zooms to for a place; x and y are fractions of the map. */
export interface MapStop {
  label: string;
  focus: MapPoint & { zoom: number };
}

/**
 * A place on the map: a rectangle (or polygon) in map pixels that reacts to the pointer.
 * `overlay` and `captions` name images in `public/map-overlays` (`hover/`, `text/`, and for the
 * captions also `card-labels/`).
 */
export interface MapSentinelConfig {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  overlay?: string;
  captions: readonly string[];
  explanation?: MapSentinelExplanation;
  link?: MapLink;
  stop?: MapStop;
  includeInIntro?: boolean;
  activationPolygon?: readonly MapPoint[];
}
