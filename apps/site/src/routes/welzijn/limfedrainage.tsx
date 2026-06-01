import { editorialPages } from "@/config/registries";
import {
  EditorialPlaceholderPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welzijn/limfedrainage")({
  head: () =>
    editorialRouteHead(editorialPages.limfedrainage, "/welzijn/limfedrainage"),
  component: LimfedrainagePage,
});

function LimfedrainagePage() {
  return <EditorialPlaceholderPage page={editorialPages.limfedrainage} />;
}
