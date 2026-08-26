import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const verhuurPage = getEditorialPage("verhuur");

export const Route = createFileRoute("/verhuur")({
  head: () => editorialRouteHead(verhuurPage, "/verhuur"),
  component: VerhuurPage,
});

function VerhuurPage() {
  return <EditorialMarkdownPage page={verhuurPage} html={verhuurPage.html} />;
}
