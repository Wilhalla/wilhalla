import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const welzijnPage = {
  ...editorialPages.welzijn,
  ...getEditorialPage("welzijn"),
};

export const Route = createFileRoute("/welzijn/")({
  head: () => editorialRouteHead(welzijnPage, "/welzijn"),
  component: WelzijnPage,
});

function WelzijnPage() {
  return <EditorialLandingPage page={welzijnPage} html={welzijnPage.html} />;
}
