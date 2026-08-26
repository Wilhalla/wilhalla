import { allPages } from "content-collections";

export function getEditorialPage(path: string) {
  const page = allPages.find((page) => page._meta.path === path);

  if (!page) {
    throw new Error(`Missing editorial page content: ${path}`);
  }

  return page;
}
