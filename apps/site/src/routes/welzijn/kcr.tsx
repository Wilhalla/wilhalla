import { editorialPages } from "@/config/registries";
import { getEditorialPage } from "@/content/editorial-pages";
import {
  EditorialMarkdownPage,
  editorialRouteHead,
} from "@/modules/editorial-page-publishing";
import { createFileRoute } from "@tanstack/react-router";

const kcrPage = {
  ...editorialPages.kcr,
  ...getEditorialPage("welzijn/kcr"),
};

export const Route = createFileRoute("/welzijn/kcr")({
  head: () => editorialRouteHead(kcrPage, "/welzijn/kcr"),
  component: KcrPage,
});

function KcrPage() {
  return <EditorialMarkdownPage page={kcrPage} html={kcrPage.html} />;
}
