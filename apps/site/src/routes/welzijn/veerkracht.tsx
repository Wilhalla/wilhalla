import { editorialPages } from "@/config/registries";
import {
  EditorialPlaceholderPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/veerkracht")({
  head: () =>
    editorialRouteHead(editorialPages.veerkracht, "/welzijn/veerkracht"),
  component: VeerkrachtPage,
});

function VeerkrachtPage() {
  return <EditorialPlaceholderPage page={editorialPages.veerkracht} />;
}
