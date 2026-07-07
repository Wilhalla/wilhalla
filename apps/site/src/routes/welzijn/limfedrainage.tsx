import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const limfedrainageContent = getEditorialPageHtml("welzijn/limfedrainage");

export const Route = createFileRoute("/welzijn/limfedrainage")({
  head: () =>
    editorialRouteHead(editorialPages.limfedrainage, "/welzijn/limfedrainage"),
  component: LimfedrainagePage,
});

function LimfedrainagePage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.limfedrainage}
      html={limfedrainageContent}
    />
  );
}
