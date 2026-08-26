import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialLandingPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const overOnsPage = {
  ...editorialPages.tuin,
  ...getEditorialPage("tuin"),
};

export const Route = createFileRoute("/over-ons/")({
  head: () => editorialRouteHead(overOnsPage, "/over-ons"),
  component: OverOnsPage,
});

function OverOnsPage() {
  return <EditorialLandingPage page={overOnsPage} html={overOnsPage.html} />;
}
