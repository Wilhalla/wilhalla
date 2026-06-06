import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const samentuinContent = getEditorialPageHtml("tuin/samentuin");

export const Route = createFileRoute("/over-ons/samentuin")({
  head: () =>
    editorialRouteHead(editorialPages.samentuin, "/over-ons/samentuin"),
  component: SamentuinPage,
});

function SamentuinPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.samentuin}
      html={samentuinContent}
    />
  );
}
