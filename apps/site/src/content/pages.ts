import type { LinkProps } from "@tanstack/react-router";
import { allPages } from "content-collections";

/**
 * Where each CMS page (`src/content/pages/<path>.md`) lives on the site. A page whose path has a
 * parent ("welzijn/kcr") gets a breadcrumb to it and is listed on the parent, in this order.
 */
const routeByPagePath = {
  tuin: "/over-ons",
  "tuin/samentuin": "/over-ons/samentuin",
  welzijn: "/welzijn",
  "welzijn/fasciatherapie": "/welzijn/fasciatherapie", // gitleaks:allow (a route, "therapie" contains "api")
  "welzijn/paardencoaching": "/welzijn/paardencoaching",
  "welzijn/muziektherapie": "/welzijn/muziektherapie", // gitleaks:allow (a route, "therapie" contains "api")
  "welzijn/lymfedrainage": "/welzijn/lymfedrainage",
  "welzijn/kcr": "/welzijn/kcr",
  "welzijn/veerkracht": "/welzijn/veerkracht",
  yoga: "/yoga",
  verhuur: "/verhuur",
  agenda: "/agenda",
  galerij: "/gallery",
  contact: "/contact",
} as const satisfies Record<string, LinkProps["to"]>;

export type PagePath = keyof typeof routeByPagePath;

function isPagePath(path: string): path is PagePath {
  return path in routeByPagePath;
}

const pagePaths = Object.keys(routeByPagePath).filter(isPagePath);

export function getPage(path: PagePath) {
  const content = allPages.find((page) => page._meta.path === path);

  if (!content) {
    throw new Error(`Missing page content: src/content/pages/${path}.md`);
  }

  return { ...content, path, to: routeByPagePath[path] };
}

export type SitePage = ReturnType<typeof getPage>;

export function getParentPage(path: PagePath) {
  const parentPath = path.slice(0, Math.max(path.lastIndexOf("/"), 0));

  return isPagePath(parentPath) ? getPage(parentPath) : undefined;
}

export function getChildPages(path: PagePath) {
  return pagePaths.filter((child) => child.startsWith(`${path}/`)).map(getPage);
}
