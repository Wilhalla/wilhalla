import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const paardencoachingPage = {
  ...editorialPages.paardencoaching,
  ...getEditorialPage("welzijn/paardencoaching"),
};

export const Route = createFileRoute("/welzijn/paardencoaching")({
  head: () =>
    editorialRouteHead(paardencoachingPage, "/welzijn/paardencoaching"),
  component: PaardencoachingPage,
});

function PaardencoachingPage() {
  return (
    <EditorialMarkdownPage
      page={paardencoachingPage}
      html={paardencoachingPage.html}
    />
  );
}
