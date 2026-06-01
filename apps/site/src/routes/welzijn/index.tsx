import { editorialPages } from "@/config/registries";
import welzijnContent from "@/content/pages/welzijn.md?raw";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/")({
  head: () => editorialRouteHead(editorialPages.welzijn, "/welzijn"),
  component: WelzijnPage,
});

function WelzijnPage() {
  return (
    <EditorialLandingPage
      page={editorialPages.welzijn}
      markdown={welzijnContent}
    />
  );
}
