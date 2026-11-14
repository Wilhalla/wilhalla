import { type PagePath, getPage } from "@/content/pages";
import { routeHead } from "@/lib/seo";
import { EditorialPage } from "@/pages/editorial-page";

/** Route options for a page that is only its CMS content: `createFileRoute(to)(editorialRoute(path))`. */
export function editorialRoute(path: PagePath) {
  return {
    head: () => pageHead(path),
    component: () => <EditorialPage path={path} />,
  };
}

export function pageHead(path: PagePath) {
  const page = getPage(path);

  return routeHead({ title: page.title, description: page.description, path: page.to });
}
