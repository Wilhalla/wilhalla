export const SITE_NAME = "Wilhalla";

export const DEFAULT_DESCRIPTION =
  "Wilhalla is een plek voor tuin, welzijn, yoga, verhuur en ontmoeting.";

export function routeMeta({
  title,
  description = DEFAULT_DESCRIPTION,
}: {
  title?: string;
  description?: string;
} = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}
