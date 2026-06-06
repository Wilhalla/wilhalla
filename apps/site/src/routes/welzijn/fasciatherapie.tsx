import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const fasciatherapieContent = getEditorialPageHtml("welzijn/fasciatherapie");

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
      html={fasciatherapieContent}
    />
  );
}
