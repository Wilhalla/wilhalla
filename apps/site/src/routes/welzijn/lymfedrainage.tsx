import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const lymfedrainageContent = getEditorialPageHtml("welzijn/lymfedrainage");

export const Route = createFileRoute("/welzijn/lymfedrainage")({
  head: () =>
    editorialRouteHead(editorialPages.lymfedrainage, "/welzijn/lymfedrainage"),
  component: LymfedrainagePage,
});

function LymfedrainagePage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.lymfedrainage}
      html={lymfedrainageContent}
    />
  );
}
