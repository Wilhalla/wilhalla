import { editorialPages } from "@/config/registries";
import fasciatherapieContent from "@/content/pages/welzijn/fasciatherapie.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/fasciatherapie")({
  head: () =>
    editorialRouteHead(
      editorialPages.fasciatherapie,
      "/welzijn/fasciatherapie",
    ),
  component: FasciatherapiePage,
});

function FasciatherapiePage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.fasciatherapie}
      markdown={fasciatherapieContent}
    />
  );
}
