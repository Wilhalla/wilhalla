import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const welzijnContent = getEditorialPageHtml("welzijn");

export const Route = createFileRoute("/welzijn/")({
  head: () => editorialRouteHead(editorialPages.welzijn, "/welzijn"),
  component: WelzijnPage,
});

function WelzijnPage() {
  return (
    <EditorialLandingPage page={editorialPages.welzijn} html={welzijnContent} />
  );
}
