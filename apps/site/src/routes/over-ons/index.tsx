import { editorialPages } from "@/config/registries";
import overOnsContent from "@/content/pages/tuin.md?raw";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/over-ons/")({
  head: () => editorialRouteHead(editorialPages.tuin, "/over-ons"),
  component: OverOnsPage,
});

function OverOnsPage() {
  return (
    <EditorialLandingPage
      page={editorialPages.tuin}
      markdown={overOnsContent}
    />
  );
}
