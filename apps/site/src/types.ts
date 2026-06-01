export type NavigationIconName =
  | "calendar"
  | "flower"
  | "heart"
  | "images"
  | "tent"
  | "users";

export type SocialIconName = "facebook" | "instagram";

export type NavigationLink = {
  label: string;
  to: string;
  icon: NavigationIconName;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
};

export type PageLink = {
  label: string;
  to: string;
};

export type PageConfig = {
  title: string;
  description: string;
  intro: string;
};

export type MapHotspotConfig = {
  id: string;
  label: string;
  route: string;
  path: string;
  labelPosition: { x: number; y: number };
};

export type MapSentinelExplanation = {
  text: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type MapSentinelConfig = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hoverImages: readonly string[];
  explanation?: MapSentinelExplanation;
  includeInIntro?: boolean;
  padding?: number;
};
