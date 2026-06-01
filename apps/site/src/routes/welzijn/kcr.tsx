import { editorialPages } from "@/config/registries";
import {
  EditorialPlaceholderPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/kcr")({
  head: () => editorialRouteHead(editorialPages.kcr, "/welzijn/kcr"),
  component: KcrPage,
});

function KcrPage() {
  return <EditorialPlaceholderPage page={editorialPages.kcr} />;
}
