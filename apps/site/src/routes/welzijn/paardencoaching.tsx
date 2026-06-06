import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const paardencoachingContent = getEditorialPageHtml("welzijn/paardencoaching");

export const Route = createFileRoute("/welzijn/paardencoaching")({
  head: () =>
    editorialRouteHead(
      editorialPages.paardencoaching,
      "/welzijn/paardencoaching",
    ),
  component: PaardencoachingPage,
});

function PaardencoachingPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.paardencoaching}
      html={paardencoachingContent}
    />
  );
}
