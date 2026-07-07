import { editorialPages } from "@/config/registries";
import { getEditorialPageHtml } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const kcrContent = getEditorialPageHtml("welzijn/kcr");

export const Route = createFileRoute("/welzijn/kcr")({
  head: () => editorialRouteHead(editorialPages.kcr, "/welzijn/kcr"),
  component: KcrPage,
});

function KcrPage() {
  return <EditorialMarkdownPage page={editorialPages.kcr} html={kcrContent} />;
}
