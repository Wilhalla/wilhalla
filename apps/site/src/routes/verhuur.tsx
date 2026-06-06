import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const verhuurContent = getEditorialPageHtml("verhuur");

export const Route = createFileRoute("/verhuur")({
  head: () => editorialRouteHead(editorialPages.verhuur, "/verhuur"),
  component: VerhuurPage,
});

function VerhuurPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.verhuur}
      html={verhuurContent}
    />
  );
}
