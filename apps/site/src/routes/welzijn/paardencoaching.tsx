import { editorialPages } from "@/config/registries";
import paardencoachingContent from "@/content/pages/welzijn/paardencoaching.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

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
      markdown={paardencoachingContent}
    />
  );
}
