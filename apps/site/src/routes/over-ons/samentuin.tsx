import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const samentuinPage = {
  ...editorialPages.samentuin,
  ...getEditorialPage("tuin/samentuin"),
};

export const Route = createFileRoute("/over-ons/samentuin")({
  head: () => editorialRouteHead(samentuinPage, "/over-ons/samentuin"),
  component: SamentuinPage,
});

function SamentuinPage() {
  return (
    <EditorialMarkdownPage page={samentuinPage} html={samentuinPage.html} />
  );
}
