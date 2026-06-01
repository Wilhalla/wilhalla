import { siteIdentity } from "@/config/registries";

export const SITE_NAME = siteIdentity.name;

export const DEFAULT_DESCRIPTION = siteIdentity.defaultDescription;

type SeoOptions = {
  title?: string;
  description?: string;
  path?: string;
};

function normalizePath(path = "/") {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function absoluteUrl(path: string) {
  const baseUrl = import.meta.env.VITE_SITE_URL || siteIdentity.url;
  return new URL(normalizePath(path), baseUrl).toString();
}

export function routeMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: SeoOptions = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = absoluteUrl(path);
  const image = siteIdentity.assets.ogImage;
  const imageUrl = absoluteUrl(image.src);

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: siteIdentity.locale },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: imageUrl },
    { property: "og:image:secure_url", content: imageUrl },
    { property: "og:image:type", content: image.type },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: image.alt },
  ];
}

export function routeHead(options: SeoOptions = {}) {
  const path = options.path ?? "/";

  return {
    meta: routeMeta({ ...options, path }),
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}
