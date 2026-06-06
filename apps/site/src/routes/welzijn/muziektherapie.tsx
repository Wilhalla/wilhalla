import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const muziektherapieContent = getEditorialPageHtml("welzijn/muziektherapie");

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
      html={muziektherapieContent}
    />
  );
}
