import { siteConfig } from "@/config";
import { getEditorialPage } from "@/content/editorial-pages";

function resolvePageLink<T extends { contentPath: string }>(link: T) {
  const { contentPath, ...rest } = link;

  return {
    ...rest,
    label: getEditorialPage(contentPath).linkLabel,
  };
}

function resolveEditorialPageConfig<
  T extends {
    subPages?: readonly { contentPath: string; to: string }[];
    breadcrumb?: readonly { contentPath: string; to?: string }[];
  },
>(page: T) {
  return {
    ...page,
    ...(page.subPages && {
      subPages: page.subPages.map(resolvePageLink),
    }),
    ...(page.breadcrumb && {
      breadcrumb: page.breadcrumb.map(resolvePageLink),
    }),
  };
}

export const siteIdentity = siteConfig.site;
export const contactRegistry = siteConfig.contact;
export const locationRegistry = siteConfig.location;
export const socialRegistry = siteConfig.socialLinks;
export const navigationRegistry = {
  links: siteConfig.navigation.links.map(resolvePageLink),
  contactLabel: getEditorialPage(siteConfig.navigation.contactContentPath)
    .linkLabel,
};
export const editorialPages = Object.fromEntries(
  Object.entries(siteConfig.pages).map(([key, page]) => [
    key,
    resolveEditorialPageConfig(page),
  ]),
) as {
  [K in keyof typeof siteConfig.pages]: ReturnType<
    typeof resolveEditorialPageConfig<(typeof siteConfig.pages)[K]>
  >;
};
export const agendaRegistry = siteConfig.agenda;
export const galleryRegistry = siteConfig.gallery;
export const interactiveMapRegistry = siteConfig.map;
