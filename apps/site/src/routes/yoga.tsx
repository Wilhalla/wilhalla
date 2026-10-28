import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const yogaPage = getEditorialPage("yoga");

export const Route = createFileRoute("/yoga")({
  head: () => editorialRouteHead(yogaPage, "/yoga"),
  component: YogaPage,
});

function YogaPage() {
  return <EditorialMarkdownPage page={yogaPage} html={yogaPage.html} />;
}
