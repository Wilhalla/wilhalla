import { editorialPages } from "@/config/registries";
import muziektherapieContent from "@/content/pages/welzijn/muziektherapie.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/muziektherapie")({
  head: () =>
    editorialRouteHead(
      editorialPages.muziektherapie,
      "/welzijn/muziektherapie",
    ),
  component: MuziektherapiePage,
});

function MuziektherapiePage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.muziektherapie}
      markdown={muziektherapieContent}
    />
  );
}
