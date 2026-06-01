import { editorialPages } from "@/config/registries";
import verhuurContent from "@/content/pages/verhuur.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verhuur")({
  head: () => editorialRouteHead(editorialPages.verhuur, "/verhuur"),
  component: VerhuurPage,
});

function VerhuurPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.verhuur}
      markdown={verhuurContent}
    />
  );
}
