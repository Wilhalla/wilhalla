import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const veerkrachtContent = getEditorialPageHtml("welzijn/veerkracht");

export const Route = createFileRoute("/welzijn/veerkracht")({
  head: () =>
    editorialRouteHead(editorialPages.veerkracht, "/welzijn/veerkracht"),
  component: VeerkrachtPage,
});

function VeerkrachtPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.veerkracht}
      html={veerkrachtContent}
    />
  );
}
