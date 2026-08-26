import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const muziektherapiePage = {
  ...editorialPages.muziektherapie,
  ...getEditorialPage("welzijn/muziektherapie"),
};

export const Route = createFileRoute("/welzijn/muziektherapie")({
  head: () => editorialRouteHead(muziektherapiePage, "/welzijn/muziektherapie"),
  component: MuziektherapiePage,
});

function MuziektherapiePage() {
  return (
    <EditorialMarkdownPage
      page={muziektherapiePage}
      html={muziektherapiePage.html}
    />
  );
}
