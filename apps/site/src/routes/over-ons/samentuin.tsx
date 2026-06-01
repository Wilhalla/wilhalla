import { editorialPages } from "@/config/registries";
import samentuinContent from "@/content/pages/tuin/samentuin.md?raw";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/over-ons/samentuin")({
  head: () =>
    editorialRouteHead(editorialPages.samentuin, "/over-ons/samentuin"),
  component: SamentuinPage,
});

function SamentuinPage() {
  return (
    <EditorialMarkdownPage
      page={editorialPages.samentuin}
      markdown={samentuinContent}
    />
  );
}
