import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const lymfedrainagePage = {
  ...editorialPages.lymfedrainage,
  ...getEditorialPage("welzijn/lymfedrainage"),
};

export const Route = createFileRoute("/welzijn/lymfedrainage")({
  head: () => editorialRouteHead(lymfedrainagePage, "/welzijn/lymfedrainage"),
  component: LymfedrainagePage,
});

function LymfedrainagePage() {
  return (
    <EditorialMarkdownPage
      page={lymfedrainagePage}
      html={lymfedrainagePage.html}
    />
  );
}
