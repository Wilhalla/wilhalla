import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const yogaContent = getEditorialPageHtml("yoga");

export const Route = createFileRoute("/yoga")({
  head: () => editorialRouteHead(editorialPages.yoga, "/yoga"),
  component: YogaPage,
});

function YogaPage() {
  return (
    <EditorialMarkdownPage page={editorialPages.yoga} html={yogaContent} />
  );
}
