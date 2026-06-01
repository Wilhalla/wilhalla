import { editorialPages } from "@/config/registries";
import yogaContent from "@/content/pages/yoga.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/yoga")({
  head: () => editorialRouteHead(editorialPages.yoga, "/yoga"),
  component: YogaPage,
});

function YogaPage() {
  return (
    <EditorialMarkdownPage page={editorialPages.yoga} markdown={yogaContent} />
  );
}
