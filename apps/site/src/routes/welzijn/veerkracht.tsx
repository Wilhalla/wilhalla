import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const veerkrachtPage = {
  ...editorialPages.veerkracht,
  ...getEditorialPage("welzijn/veerkracht"),
};

export const Route = createFileRoute("/welzijn/veerkracht")({
  head: () => editorialRouteHead(veerkrachtPage, "/welzijn/veerkracht"),
  component: VeerkrachtPage,
});

function VeerkrachtPage() {
  return (
    <EditorialMarkdownPage page={veerkrachtPage} html={veerkrachtPage.html} />
  );
}
