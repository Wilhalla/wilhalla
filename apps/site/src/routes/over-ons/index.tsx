import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const overOnsContent = getEditorialPageHtml("tuin");

export const Route = createFileRoute("/over-ons/")({
  head: () => editorialRouteHead(editorialPages.tuin, "/over-ons"),
  component: OverOnsPage,
});

function OverOnsPage() {
  return (
    <EditorialLandingPage page={editorialPages.tuin} html={overOnsContent} />
  );
}
