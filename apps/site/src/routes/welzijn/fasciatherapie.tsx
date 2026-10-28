import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const fasciatherapiePage = {
  ...editorialPages.fasciatherapie,
  ...getEditorialPage("welzijn/fasciatherapie"),
};

export const Route = createFileRoute("/welzijn/fasciatherapie")({
  head: () => editorialRouteHead(fasciatherapiePage, "/welzijn/fasciatherapie"),
  component: FasciatherapiePage,
});

function FasciatherapiePage() {
  return (
    <EditorialMarkdownPage
      page={fasciatherapiePage}
      html={fasciatherapiePage.html}
    />
  );
}
